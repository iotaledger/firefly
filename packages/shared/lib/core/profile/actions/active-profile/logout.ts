import { closePopup } from '@auxiliary/popup'
import { resetSelectedAccount } from '@core/account'
import { clearPollProposalStatusInterval } from '@core/governance'
import { isPollingLedgerDeviceStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
import { clearPollMarketPrices } from '@core/market/actions'
import { clearPollNetworkInterval } from '@core/network'
import {
    activeAccounts,
    activeProfile,
    isLedgerProfile,
    isSoftwareProfile,
    lockStronghold,
    resetActiveProfile,
} from '@core/profile'
import { destroyProfileManager, unsubscribeFromWalletApiEvents } from '@core/profile-manager'
import { profileManager } from '@core/profile-manager/stores'
import { routerManager } from '@core/router/stores'
import { get } from 'svelte/store'
import { resetDashboardState } from '../resetDashboardState'

/**
 * Logout from active profile
 */
export function logout(clearActiveProfile: boolean = true, _lockStronghold: boolean = true): Promise<void> {
    const { lastActiveAt, loggedIn, hasLoadedAccounts, type } = get(activeProfile)

    // (TODO): Figure out why we are using a promise here?
    return new Promise((resolve) => {
        if (get(isSoftwareProfile)) {
            _lockStronghold && lockStronghold()
        } else if (isLedgerProfile(type)) {
            get(isPollingLedgerDeviceStatus) && stopPollingLedgerNanoStatus()
        }

        clearPollNetworkInterval()
        clearPollMarketPrices()
        clearPollProposalStatusInterval()
        const _activeProfile = get(activeProfile)
        if (_activeProfile) {
            const manager = get(profileManager)

            unsubscribeFromWalletApiEvents()

            // stop background sync
            // TODO: Make sure we need this. Would destroying the profile manager also stop background syncing automatically?
            manager?.stopBackgroundSync()

            // Unsubscribe to listeners
            // https://github.com/iotaledger/wallet.rs/issues/1133

            destroyProfileManager()
        }

        // TODO: clean up the state management
        lastActiveAt.set(new Date())
        closePopup(true)
        loggedIn.set(false)
        hasLoadedAccounts.set(false)
        resetSelectedAccount()
        activeAccounts.set([])
        if (clearActiveProfile) {
            resetActiveProfile()
        }
        resetDashboardState()
        get(routerManager).resetRouters()

        resolve()
    })
}
