import { createNewAccount, setSelectedAccount } from '@core/account'
import { getAndUpdateNodeInfo } from '@core/network'
import {
    buildProfileManagerOptionsFromProfileData,
    initialiseProfileManager,
    isStrongholdUnlocked,
    profileManager,
    recoverAccounts,
} from '@core/profile-manager'
import {
    setStrongholdPasswordClearInterval,
    startBackgroundSync,
    subscribe as subscribeToWalletEvents,
} from '@core/profile-manager/api'
import { loginRouter } from '@core/router'
import { loadAllAccountActivities, refreshAccountAssetsForActiveProfile } from '@core/wallet'
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

export async function login(isOnboardingFlow?: boolean, shouldRecoverAccounts?: boolean): Promise<void> {
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
            await getAndUpdateNodeInfo()

            // Step 3: load and build all the profile data
            incrementLoginProgress()
            if (isOnboardingFlow && shouldRecoverAccounts) {
                await recoverAccounts(INITIAL_ACCOUNT_GAP_LIMIT[type], INITIAL_ADDRESS_GAP_LIMIT[type])
            } else if (isOnboardingFlow) {
                await createNewAccount()
            }

            // Step 4: load accounts
            incrementLoginProgress()
            await loadAccounts()

            // Step 5: load assets
            incrementLoginProgress()
            await refreshAccountAssetsForActiveProfile()

            // Step 6: load account activities
            incrementLoginProgress()
            await loadAllAccountActivities()

            // Step 7: set initial stronghold status
            incrementLoginProgress()
            const strongholdUnlocked = await isStrongholdUnlocked()
            isStrongholdLocked.set(!strongholdUnlocked)
            setStrongholdPasswordClearInterval(STRONGHOLD_PASSWORD_CLEAR_INTERVAL)
            if (strongholdUnlocked) {
                setTimeStrongholdLastUnlocked()
            }

            // Step 8: start background sync
            incrementLoginProgress()
            subscribeToWalletEvents()
            await startBackgroundSync({ syncIncomingTransactions: true })

            // Step 9: finish login
            incrementLoginProgress()
            setSelectedAccount(lastUsedAccountId ?? get(activeAccounts)?.[0]?.id ?? null)
            lastActiveAt.set(new Date())
            loggedIn.set(true)
            setTimeout(() => {
                _loginRouter.next()
                resetLoginProgress()
            }, 500)
        }
    } catch (err) {
        console.error(err)
        _loginRouter.previous()
        resetLoginProgress()
    }
}
