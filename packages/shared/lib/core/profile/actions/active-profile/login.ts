import { initializeRegisteredProposals, registerProposalsFromNodes } from '@contexts/governance/actions'
import { cleanupOnboarding } from '@contexts/onboarding/actions'
import { createNewAccount, setSelectedAccount } from '@core/account/actions'
import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
import { IAccount } from '@core/account/interfaces'
import { Platform } from '@core/app/classes'
import { AppContext } from '@core/app/enums'
import { handleError } from '@core/error/handlers'
import { pollLedgerNanoStatus } from '@core/ledger/actions'
import { pollMarketPrices } from '@core/market/actions'
import { pollNetworkStatus } from '@core/network/actions'
import { initialiseProfileManager } from '@core/profile-manager/actions'
import { loadNftsForActiveProfile } from '@core/nfts'
import {
    getAccounts,
    isStrongholdUnlocked,
    recoverAccounts,
    setStrongholdPasswordClearInterval,
    startBackgroundSync,
} from '@core/profile-manager/api'
import { RecoverAccountsPayload } from '@core/profile-manager/interfaces'
import { profileManager } from '@core/profile-manager/stores'
import { buildProfileManagerOptionsFromProfileData } from '@core/profile-manager/utils'
import { routerManager } from '@core/router/stores'
import { SECONDS_PER_MINUTE } from '@core/utils'
import { sleep } from '@core/utils/os'
import { generateAndStoreActivitiesForAllAccounts, refreshAccountAssetsForActiveProfile } from '@core/wallet/actions'
import { get } from 'svelte/store'
import {
    CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL,
    CHECK_PREVIOUS_MANAGER_IS_DESTROYED_MAX_COUNT,
    DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION,
} from '../../constants'
import { ProfileType } from '../../enums'
import { ILoginOptions } from '../../interfaces'
import {
    activeAccounts,
    activeProfile,
    incrementLoginProgress,
    isDestroyingManager,
    resetLoginProgress,
    setTimeStrongholdLastUnlocked,
    updateActiveProfile,
} from '../../stores'
import { isLedgerProfile } from '../../utils'
import { loadAccounts } from './loadAccounts'
import { logout } from './logout'
import { subscribeToWalletApiEventsForActiveProfile } from './subscribeToWalletApiEventsForActiveProfile'
import { checkAndUpdateActiveProfileNetwork } from './checkAndUpdateActiveProfileNetwork'
import { checkAndRemoveProfilePicture } from './checkAndRemoveProfilePicture'
import { checkActiveProfileAuth } from '@core/profile'

export async function login(loginOptions?: ILoginOptions): Promise<void> {
    const loginRouter = get(routerManager).getRouterForAppContext(AppContext.Login)
    try {
        const _activeProfile = get(activeProfile)
        const { loggedIn, lastActiveAt, id, isStrongholdLocked, type, lastUsedAccountIndex } = _activeProfile
        if (id) {
            // Step 1: create profile manager if its doesn't exist
            incrementLoginProgress()
            await waitForPreviousManagerToBeDestroyed()
            if (!get(profileManager)) {
                const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(_activeProfile)
                const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
                // Make sure the profile has the latest client options that we are using
                updateActiveProfile({ clientOptions })
                const manager = await initialiseProfileManager(id, storagePath, coinType, clientOptions, secretManager)
                profileManager.set(manager)
            }

            // Step 3: load and build all the profile data
            incrementLoginProgress()
            let accounts: IAccount[]
            if (loginOptions?.isFromOnboardingFlow && loginOptions?.shouldRecoverAccounts) {
                const { initialAccountRange, addressGapLimit } = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type]
                const recoverAccountsPayload: RecoverAccountsPayload = {
                    accountStartIndex: 0,
                    accountGapLimit: initialAccountRange,
                    addressGapLimit,
                    syncOptions: DEFAULT_SYNC_OPTIONS,
                }
                accounts = await recoverAccounts(recoverAccountsPayload)
            } else {
                accounts = await getAccounts()
            }
            /**
             * NOTE: In the case no accounts with funds were recovered, we must
             * create one for the new profile.
             */
            if (accounts?.length === 0) {
                const onUnlocked = new Promise<boolean>((resolve) => {
                    const onSuccess = () => {
                        resolve(true)
                        return Promise.resolve()
                    }
                    const onCancel = () => resolve(false)
                    const config = { stronghold: false, ledger: false }
                    checkActiveProfileAuth(onSuccess, config, onCancel)
                })
                const success = await onUnlocked
                if (success) {
                    await createNewAccount()
                } else {
                    resetLoginProgress()
                    return loginRouter.previous()
                }
            }

            // Step 4: load accounts
            incrementLoginProgress()
            await loadAccounts()

            let initialSelectedAccountindex = get(activeAccounts)?.[0]?.index
            if (
                lastUsedAccountIndex &&
                get(activeAccounts)?.find((_account) => _account.index === lastUsedAccountIndex)
            ) {
                initialSelectedAccountindex = lastUsedAccountIndex
            }
            setSelectedAccount(initialSelectedAccountindex)

            // Step 2: get node info to check we have a synced node
            incrementLoginProgress()
            await checkAndUpdateActiveProfileNetwork()
            void pollNetworkStatus()

            // Step 5: load assets
            incrementLoginProgress()
            await refreshAccountAssetsForActiveProfile(
                _activeProfile.forceAssetRefresh,
                _activeProfile.forceAssetRefresh
            )
            updateActiveProfile({ forceAssetRefresh: false })
            await loadNftsForActiveProfile()
            checkAndRemoveProfilePicture()

            // Step 6: generate and store activities for all accounts
            incrementLoginProgress()
            await generateAndStoreActivitiesForAllAccounts()

            if (type === ProfileType.Software) {
                // Step 7: set initial stronghold status
                incrementLoginProgress()
                const strongholdUnlocked = await isStrongholdUnlocked()
                isStrongholdLocked.set(!strongholdUnlocked)
                await setStrongholdPasswordClearInterval(
                    _activeProfile.settings.strongholdPasswordTimeoutInMinutes * SECONDS_PER_MINUTE
                )
                if (strongholdUnlocked) {
                    setTimeStrongholdLastUnlocked()
                }
            } else {
                Platform.startLedgerProcess()
                incrementLoginProgress(2)
            }

            // Step 8: start background sync
            incrementLoginProgress()
            subscribeToWalletApiEventsForActiveProfile()
            await startBackgroundSync({ syncIncomingTransactions: true })

            // Step 9: finish login
            incrementLoginProgress()
            if (isLedgerProfile(type)) {
                pollLedgerNanoStatus()
            }
            lastActiveAt.set(new Date())
            loggedIn.set(true)
            setTimeout(() => {
                loginRouter?.next()
                resetLoginProgress()
            }, 500)

            void pollMarketPrices()
            if (Platform.isFeatureFlagEnabled('governance')) {
                void initializeRegisteredProposals()
                void registerProposalsFromNodes(get(activeAccounts))
            }
            void cleanupOnboarding()
        } else {
            throw Error('No active profile error')
        }
    } catch (err) {
        console.log(err)
        handleError(err)
        if (!loginOptions?.isFromOnboardingFlow) {
            void logout(false)
        }
        loginRouter?.previous()
        resetLoginProgress()
    }
}

async function waitForPreviousManagerToBeDestroyed(): Promise<void> {
    for (let count = 0; count < CHECK_PREVIOUS_MANAGER_IS_DESTROYED_MAX_COUNT; count++) {
        if (!get(isDestroyingManager)) {
            return Promise.resolve()
        }
        await sleep(CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL)
    }
    return Promise.reject()
}
