import { resetRouters } from '@core/router'
import { clearSendParams } from '@lib/app'
import { stopPollingLedgerStatus } from '@lib/ledger'
import { closePopup } from '@lib/popup'
import { get } from 'svelte/store'
import { destroyProfileManager } from '@core/profile-manager'
import { profileManager } from '@core/profile-manager/stores'
import { resetDashboardState } from '../unknown'
import { clearPollNetworkInterval } from '@core/network'
import { resetActiveProfile, activeProfile, isLedgerProfile, isSoftwareProfile, activeAccounts } from '@core/profile'
import { resetSelectedAccount } from '@core/account'

/**
 * Logout from active profile
 */
export function logout(clearActiveProfile: boolean = false, _lockStronghold: boolean = true): Promise<void> {
    const { isStrongholdLocked, lastActiveAt, loggedIn, hasLoadedAccounts } = get(activeProfile)

    // (TODO): Figure out why we are using a promise here?
    return new Promise((resolve) => {
        if (_lockStronghold && get(isSoftwareProfile) && !get(isStrongholdLocked)) {
            // TODO: Lock stronghold on using profile manager
            isStrongholdLocked.set(true)
        } else if (get(isLedgerProfile)) {
            stopPollingLedgerStatus()
        }

        clearPollNetworkInterval()
        const _activeProfile = get(activeProfile)
        if (_activeProfile) {
            destroyProfileManager()
        }

        // TODO: clean up the state management
        lastActiveAt.set(new Date())
        clearSendParams()
        closePopup(true)
        loggedIn.set(false)
        hasLoadedAccounts.set(false)
        resetSelectedAccount()
        activeAccounts.set([])
        if (clearActiveProfile) {
            resetActiveProfile()
        }
        resetDashboardState()
        resetRouters()

        const manager = get(profileManager)

        // start background sync
        manager.startBackgroundSync()

        // Unsubscribe to listeners
        // https://github.com/iotaledger/wallet.rs/issues/1133
        resolve()
    })
}
