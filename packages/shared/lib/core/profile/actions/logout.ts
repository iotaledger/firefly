import { resetRouters } from '@core/router'
import { clearSendParams, lastActiveAt, loggedIn } from '@lib/app'
import { stopPollingLedgerStatus } from '@lib/ledger'
import { closePopup } from '@lib/popup'
import { clearActiveProfile } from '@lib/profile'
import { destroyManager } from '@lib/wallet'
import { get } from 'svelte/store'
import { activeProfile, isLedgerProfile, isSoftwareProfile } from '../stores'
import { resetActiveProfile } from './active-profile'

const { isStrongholdLocked } = get(activeProfile)

/**
 * Logout from current profile
 */
export function logout(_clearActiveProfile: boolean = false, _lockStronghold: boolean = true): Promise<void> {
    return new Promise<void>((resolve) => {
        if (_lockStronghold && get(isSoftwareProfile) && !get(isStrongholdLocked)) {
            // TODO: Lock stronghold on using profile manager
            isStrongholdLocked.set(true)
        } else if (get(isLedgerProfile)) {
            stopPollingLedgerStatus()
        }

        const _activeProfile = get(activeProfile)
        if (_activeProfile) {
            destroyManager()
        }

        // TODO: clean up the state management
        lastActiveAt.set(new Date())
        clearSendParams()
        closePopup(true)
        loggedIn.set(false)
        if (_clearActiveProfile) {
            clearActiveProfile()
        }
        resetActiveProfile()
        resetRouters()

        resolve()
    })
}
