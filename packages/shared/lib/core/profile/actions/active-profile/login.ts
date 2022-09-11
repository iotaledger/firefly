import { createNewAccount, setSelectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers/handleError'
import { getAndUpdateNodeInfo, pollNetworkStatus } from '@core/network'
import {
    buildProfileManagerOptionsFromProfileData,
    initialiseProfileManager,
    isStrongholdUnlocked,
    profileManager,
    recoverAccounts,
} from '@core/profile-manager'
import { setStrongholdPasswordClearInterval, startBackgroundSync } from '@core/profile-manager/api'
import { ProfileType } from '@core/profile/enums'
import { loginRouter } from '@core/router'
import { generateAndStoreActivitiesForAllAccounts, refreshAccountAssetsForActiveProfile } from '@core/wallet'
import { get } from 'svelte/store'
import {
    INITIAL_ACCOUNT_GAP_LIMIT,
    INITIAL_ADDRESS_GAP_LIMIT,
    STRONGHOLD_PASSWORD_CLEAR_INTERVAL,
} from '../../constants'
import {
    activeAccounts,
    activeProfile,
    incrementLoginProgress,
    resetLoginProgress,
    setTimeStrongholdLastUnlocked,
} from '../../stores'
import { loadAccounts } from './loadAccounts'
import { ILoginOptions } from '../../interfaces'
import { logout } from './logout'
import { pollLedgerNanoStatus } from '@core/ledger'
import { isLedgerProfile } from '@core/profile/utils'
import { subscribeToWalletApiEventsForActiveProfile } from '@core/profile-manager/actions/subscribeToWalletApiEventsForActiveProfile'

export async function login(loginOptions?: ILoginOptions): Promise<void> {
    const _loginRouter = get(loginRouter)
    try {
        const _activeProfile = get(activeProfile)
        const { loggedIn, lastActiveAt, id, isStrongholdLocked, type, lastUsedAccountId } = _activeProfile
        if (id) {
            // Step 1: create profile manager if its doesn't exist
            incrementLoginProgress()
            if (!get(profileManager)) {
                const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(_activeProfile)
                const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
                const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, id)
                profileManager.set(manager)
            }

            // Step 2: get node info to check we have a synced node
            incrementLoginProgress()
            await getAndUpdateNodeInfo(true)
            void pollNetworkStatus()

            // Step 3: load and build all the profile data
            incrementLoginProgress()
            if (loginOptions) {
                const { isFromOnboardingFlow, shouldRecoverAccounts, shouldCreateAccount } = loginOptions
                if (isFromOnboardingFlow && shouldRecoverAccounts) {
                    const accountMetadatas = await recoverAccounts(
                        INITIAL_ACCOUNT_GAP_LIMIT[type],
                        INITIAL_ADDRESS_GAP_LIMIT[type]
                    )

                    /**
                     * NOTE: In the case no accounts with funds were recovered, we must
                     * create one for the new profile.
                     */
                    if (accountMetadatas?.length === 0) {
                        await createNewAccount()
                    }
                } else if (isFromOnboardingFlow && shouldCreateAccount) {
                    await createNewAccount()
                }
            }

            // Step 4: load accounts
            incrementLoginProgress()
            await loadAccounts()

            // Step 5: load assets
            incrementLoginProgress()
            await refreshAccountAssetsForActiveProfile()

            // Step 6: generate and store activities for all accounts
            incrementLoginProgress()
            await generateAndStoreActivitiesForAllAccounts()

            if (type === ProfileType.Software) {
                // Step 7: set initial stronghold status
                incrementLoginProgress()
                const strongholdUnlocked = await isStrongholdUnlocked()
                isStrongholdLocked.set(!strongholdUnlocked)
                setStrongholdPasswordClearInterval(STRONGHOLD_PASSWORD_CLEAR_INTERVAL)
                if (strongholdUnlocked) {
                    setTimeStrongholdLastUnlocked()
                }
            } else {
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
            setSelectedAccount(lastUsedAccountId ?? get(activeAccounts)?.[0]?.id ?? null)
            lastActiveAt.set(new Date())
            loggedIn.set(true)
            setTimeout(() => {
                _loginRouter.next()
                resetLoginProgress()
            }, 500)
        }
    } catch (err) {
        handleError(err)
        await logout()
        _loginRouter.previous()
        resetLoginProgress()
    }
}
