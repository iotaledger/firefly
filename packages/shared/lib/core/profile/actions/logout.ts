import { resetRouters } from '@core/router'
import { clearSendParams, lastActiveAt, loggedIn } from '@lib/app'
import { stopPollingLedgerStatus } from '@lib/ledger'
import { closePopup } from '@lib/popup'
import { get } from 'svelte/store'
import { destroyProfileManager } from '@core/profile-manager'
import { activeProfile, isLedgerProfile, isSoftwareProfile, resetActiveProfile, resetActiveProfileId } from '../stores'
import { resetDashboardState } from './active-profile'
import { clearPollNetworkInterval } from '@core/network'

const { isStrongholdLocked } = get(activeProfile)

/**
 * Logout from current profile
 */
export function logout(clearActiveProfile: boolean = false, _lockStronghold: boolean = true): Promise<void> {
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
        if (clearActiveProfile) {
            resetActiveProfile()
            resetActiveProfileId()
        }
        resetDashboardState()
        resetRouters()
        resolve()
    })
}
