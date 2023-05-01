import { resetSelectedAccountIndex } from '@core/account'
import {
    clearSelectedParticipationEventStatus,
    resetProposalOverviews,
    resetRegisteredProposals,
} from '@contexts/governance/stores'
import { isPollingLedgerDeviceStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
import { clearMarketPricesPoll } from '@core/market/actions'
import { clearChainStatusesPoll, clearNetworkPoll } from '@core/network'
import {
    activeAccounts,
    activeProfile,
    isLedgerProfile,
    isSoftwareProfile,
    lockStronghold,
    resetActiveProfile,
    isDestroyingManager,
} from '@core/profile'
import { destroyProfileManager, IProfileManager, unsubscribeFromWalletApiEvents } from '@core/profile-manager'
import { profileManager } from '@core/profile-manager/stores'
import { routerManager } from '@core/router/stores'
import { get } from 'svelte/store'
import { clearFilters } from '@core/utils'
import { stopDownloadingNftMediaFromQueue } from '@core/nfts'

/**
 * Logout from active profile
 */
export function logout(clearActiveProfile = true, _lockStronghold = true): void {
    if (get(isSoftwareProfile)) {
        _lockStronghold && lockStronghold()
    } else if (isLedgerProfile(get(activeProfile).type)) {
        get(isPollingLedgerDeviceStatus) && stopPollingLedgerNanoStatus()
    }

    clearNetworkPoll()
    clearChainStatusesPoll()
    clearMarketPricesPoll()

    const _activeProfile = get(activeProfile)
    if (_activeProfile) {
        const manager = get(profileManager)
        void destroyWalletRsObjects(manager)
    }

    cleanupProfileState(clearActiveProfile)
}

function cleanupProfileState(clearActiveProfile: boolean): void {
    const { lastActiveAt, loggedIn, hasLoadedAccounts } = get(activeProfile)

    loggedIn.set(false)
    lastActiveAt.set(new Date())
    hasLoadedAccounts.set(false)
    resetSelectedAccountIndex()

    void stopDownloadingNftMediaFromQueue()

    // Governance Stores
    resetRegisteredProposals()
    resetProposalOverviews()
    clearSelectedParticipationEventStatus()

    activeAccounts.set([])
    if (clearActiveProfile) {
        resetActiveProfile()
    }
    clearFilters()
    get(routerManager).resetRouters()
}

async function destroyWalletRsObjects(manager: IProfileManager): Promise<void> {
    isDestroyingManager.set(true)
    await manager?.stopBackgroundSync()
    await unsubscribeFromWalletApiEvents()
    await destroyProfileManager()
    isDestroyingManager.set(false)
}
