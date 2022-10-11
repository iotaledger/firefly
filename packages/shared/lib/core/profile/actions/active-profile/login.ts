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
import { getAccounts, setStrongholdPasswordClearInterval, startBackgroundSync } from '@core/profile-manager/api'
import { ProfileType } from '@core/profile/enums'
import { loginRouter } from '@core/router'
import { generateAndStoreActivitiesForAllAccounts, refreshAccountAssetsForActiveProfile } from '@core/wallet'
import { get } from 'svelte/store'
import { DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION, STRONGHOLD_PASSWORD_CLEAR_INTERVAL } from '../../constants'
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

import { subscribeToWalletApiEventsForActiveProfile } from './subscribeToWalletApiEventsForActiveProfile'
import { cleanupOnboarding } from '@contexts/onboarding'

export async function login(loginOptions?: ILoginOptions): Promise<void> {
    const _loginRouter = get(loginRouter)
    try {
        const _activeProfile = get(activeProfile)
        const { loggedIn, lastActiveAt, id, isStrongholdLocked, type, lastUsedAccountIndex } = _activeProfile
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
            let accounts
            if (loginOptions?.isFromOnboardingFlow && loginOptions?.shouldRecoverAccounts) {
                const { initialAccountRange, addressGapLimit } = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type]
                accounts = await recoverAccounts(0, initialAccountRange, addressGapLimit, {
                    syncIncomingTransactions: true,
                })
            } else {
                accounts = await getAccounts()
            }
            /**
             * NOTE: In the case no accounts with funds were recovered, we must
             * create one for the new profile.
             */
            if (accounts?.length === 0) {
                await createNewAccount()
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
            setSelectedAccount(lastUsedAccountIndex ?? get(activeAccounts)?.[0]?.index ?? null)
            lastActiveAt.set(new Date())
            loggedIn.set(true)
            setTimeout(() => {
                _loginRouter.next()
                resetLoginProgress()
            }, 500)

            void cleanupOnboarding()
        } else {
            throw Error('No active profile error')
        }
    } catch (err) {
        handleError(err)
        if (!loginOptions?.isFromOnboardingFlow) {
            await logout(false)
        }
        _loginRouter.previous()
        resetLoginProgress()
    }
}
