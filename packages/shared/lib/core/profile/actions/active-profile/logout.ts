import { closePopup } from '@auxiliary/popup'
import { resetSelectedAccount } from '@core/account'
import { clearGovernancePollAndData } from '@contexts/governance'
import { resetPendingGovernanceTransactionIds } from '@contexts/governance/stores'
import { isPollingLedgerDeviceStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
import { clearMarketPricesPoll } from '@core/market/actions'
import { clearNetworkPoll } from '@core/network'
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

/**
 * Logout from active profile
 */
export async function logout(clearActiveProfile: boolean = true, _lockStronghold: boolean = true): Promise<void> {
    const { lastActiveAt, loggedIn, hasLoadedAccounts, type } = get(activeProfile)
    await unsubscribeFromWalletApiEvents()

    // (TODO): Figure out why we are using a promise here?
    return new Promise((resolve) => {
        if (get(isSoftwareProfile)) {
            _lockStronghold && lockStronghold()
        } else if (isLedgerProfile(type)) {
            get(isPollingLedgerDeviceStatus) && stopPollingLedgerNanoStatus()
        }

        clearNetworkPoll()
        clearMarketPricesPoll()
        clearGovernancePollAndData()
        const _activeProfile = get(activeProfile)
        if (_activeProfile) {
            const manager = get(profileManager)

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
        resetPendingGovernanceTransactionIds()
        activeAccounts.set([])
        if (clearActiveProfile) {
            resetActiveProfile()
        }
        get(routerManager).resetRouters()

        resolve()
    })
}
