import { initializeRegisteredProposals, registerProposalsFromNodes } from '@contexts/governance/actions'
import { cleanupOnboarding } from '@contexts/onboarding/actions'
import { Platform } from '@core/app/classes'
import { AppContext } from '@core/app/enums'
import { handleError } from '@core/error/handlers'
import { pollLedgerNanoStatus } from '@core/ledger/actions'
import { pollMarketPrices } from '@core/market/actions'
import { pollNetworkStatus } from '@core/network/actions'
import { loadNftsForActiveProfile } from '@core/nfts'
import { routerManager } from '@core/router/stores'
import { SECONDS_PER_MINUTE } from '@core/utils'
import { sleep } from '@core/utils/os'
import {
    createNewWallet,
    generateAndStoreActivitiesForAllWallets,
    isStrongholdUnlocked,
    refreshWalletAssetsForActiveProfile,
    setSelectedWallet,
} from '@core/wallet/actions'
import { get } from 'svelte/store'
import {
    CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL,
    CHECK_PREVIOUS_MANAGER_IS_DESTROYED_MAX_COUNT,
} from '../../constants'
import { ProfileType } from '../../enums'
import { ILoginOptions, IWallet } from '../../interfaces'
import {
    activeProfile,
    activeWallets,
    incrementLoginProgress,
    isDestroyingWallets,
    resetLoginProgress,
    setTimeStrongholdLastUnlocked,
    updateActiveProfile,
} from '../../stores'
import { isLedgerProfile } from '../../utils'
import { loadWallets } from './loadWallets'
import { logout } from './logout'
import { subscribeToWalletApiEventsForActiveProfile } from './subscribeToWalletApiEventsForActiveProfile'
import { checkAndUpdateActiveProfileNetwork } from './checkAndUpdateActiveProfileNetwork'
import { checkAndRemoveProfilePicture } from './checkAndRemoveProfilePicture'
import { checkActiveProfileAuth, getWallets } from '@core/profile'
import { setStrongholdPasswordClearInterval, startBackgroundSync } from '@core/wallet/actions'
import { selectedWallet } from 'shared/lib/core/wallet'

// TODO(2.0) Remove usage of profile manager
export async function login(loginOptions?: ILoginOptions): Promise<void> {
    const loginRouter = get(routerManager).getRouterForAppContext(AppContext.Login)
    try {
        const _activeProfile = get(activeProfile)
        const { loggedIn, lastActiveAt, id, isStrongholdLocked, type } = _activeProfile
        if (id) {
            // Step 1: create profile manager if its doesn't exist
            incrementLoginProgress()
            await waitForPreviousManagerToBeDestroyed()

            // Step 3: load and build all the profile data
            incrementLoginProgress()
            let wallets: IWallet[] = []

            if (loginOptions?.isFromOnboardingFlow && loginOptions?.shouldRecoverWallets) {
                /*
                const { initialAccountRange, addressGapLimit } = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type]
                const recoverAccountsPayload: RecoverAccountsPayload = {
                    accountStartIndex: 0,
                    accountGapLimit: initialAccountRange,
                    addressGapLimit,
                    syncOptions: DEFAULT_SYNC_OPTIONS,
                }
                accounts = await recoverAccounts(recoverAccountsPayload)
                */
            } else {
                wallets = await getWallets()
            }
            /**
             * NOTE: In the case no wallets with funds were recovered, we must
             * create one for the new profile.
             */
            if (wallets?.length === 0) {
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
                    await createNewWallet()
                } else {
                    resetLoginProgress()
                    return loginRouter.previous()
                }
            }

            // Step 4: load wallets
            incrementLoginProgress()
            await loadWallets()

            const initialSelectedWalletId = get(activeWallets)?.[0]?.id

            // TODO(2.0): is needed lastUsedWalletId?
            // if (
            //     initialSelectedWalletId &&
            //     get(activeWallets)?.find((wallet) => wallet.id === initialSelectedWalletId)
            // ) {
            //     initialSelectedWalletId = lastUsedWalletId
            // }
            // console.log("initialSelectedWalletId", initialSelectedWalletId);

            setSelectedWallet(initialSelectedWalletId)

            // Step 2: get node info to check we have a synced node
            incrementLoginProgress()
            await checkAndUpdateActiveProfileNetwork()
            void pollNetworkStatus()

            // Step 5: load assets
            incrementLoginProgress()
            await refreshWalletAssetsForActiveProfile(
                _activeProfile.forceAssetRefresh,
                _activeProfile.forceAssetRefresh
            )
            updateActiveProfile({ forceAssetRefresh: false })
            await loadNftsForActiveProfile()
            checkAndRemoveProfilePicture()

            // Step 6: generate and store activities for all wallets
            incrementLoginProgress()
            await generateAndStoreActivitiesForAllWallets()

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
            if (get(selectedWallet)?.accountOutputs.length === 0) {
                await startBackgroundSync({ syncIncomingTransactions: true, syncImplicitAccounts: true })
            } else {
                await startBackgroundSync({ syncIncomingTransactions: true })
            }

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
                void registerProposalsFromNodes(get(activeWallets))
            }
            void cleanupOnboarding()
        } else {
            throw Error('No active profile error')
        }
    } catch (err) {
        console.error(err)
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
        if (!get(isDestroyingWallets)) {
            return Promise.resolve()
        }
        await sleep(CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL)
    }
    return Promise.reject()
}
