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
export async function logout(clearActiveProfile = true, _lockStronghold = true): Promise<void> {
    if (get(isSoftwareProfile)) {
        _lockStronghold && lockStronghold()
    } else if (isLedgerProfile(get(activeProfile).type)) {
        get(isPollingLedgerDeviceStatus) && stopPollingLedgerNanoStatus()
    }

    clearNetworkPoll()
    clearMarketPricesPoll()
    clearGovernancePollAndData()

    const _activeProfile = get(activeProfile)
    if (_activeProfile) {
        const manager = get(profileManager)
        await manager?.stopBackgroundSync()
        await unsubscribeFromWalletApiEvents()
        destroyProfileManager()
    }

    cleanupProfileState(clearActiveProfile)
}

function cleanupProfileState(clearActiveProfile: boolean): void {
    const { lastActiveAt, loggedIn, hasLoadedAccounts } = get(activeProfile)

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
}
