import { get } from 'svelte/store'

import {
    clearSelectedParticipationEventStatus,
    resetProposalOverviews,
    resetRegisteredProposals,
} from '@contexts/governance/stores'
import { stopPollingLedgerNanoStatus } from '@core/ledger/actions'
import { isPollingLedgerDeviceStatus } from '@core/ledger/stores'
import { clearMarketPricesPoll } from '@core/market/actions'
import { clearNetworkPoll } from '@core/network/actions'
import { stopDownloadingNftMediaFromQueue } from '@core/nfts/actions'
import { clearProfileFromMemory, lockStronghold, resetActiveProfile } from '@core/profile/actions'
import { activeProfile, isSoftwareProfile, isDestroyingWallets, activeWallets } from '@core/profile/stores'
import { isLedgerProfile } from '@core/profile/utils'
import { routerManager } from '@core/router/stores'
import { clearFilters } from '@core/utils/clearFilters'
import { unsubscribeFromWalletApiEvents, resetSelectedWalletId, clearBalanceSyncPoll } from '@core/wallet'

/**
 * Logout from active profile
 */
export async function logout(clearActiveProfile = true, _lockStronghold = true): Promise<void> {
    if (get(isSoftwareProfile)) {
        _lockStronghold && lockStronghold()
    } else if (isLedgerProfile(get(activeProfile).type)) {
        get(isPollingLedgerDeviceStatus) && stopPollingLedgerNanoStatus()
    }

    clearBalanceSyncPoll()
    clearNetworkPoll()
    clearMarketPricesPoll()

    get(routerManager).resetRouters()

    const _activeProfile = get(activeProfile)
    if (_activeProfile) {
        await logOutProfile()
    }

    cleanupProfileState(clearActiveProfile)
}

function cleanupProfileState(clearActiveProfile: boolean): void {
    const { lastActiveAt, loggedIn, hasLoadedWallets } = get(activeProfile)

    loggedIn.set(false)
    lastActiveAt.set(new Date())
    hasLoadedWallets.set(false)
    resetSelectedWalletId()

    void stopDownloadingNftMediaFromQueue()

    // Governance Stores
    resetRegisteredProposals()
    resetProposalOverviews()
    clearSelectedParticipationEventStatus()

    activeWallets.set([])
    if (clearActiveProfile) {
        resetActiveProfile()
    }
    clearFilters()
}

async function logOutProfile(): Promise<void> {
    isDestroyingWallets.set(true)
    await unsubscribeFromWalletApiEvents()
    await clearProfileFromMemory()
    isDestroyingWallets.set(false)
}
