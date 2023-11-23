import { get } from 'svelte/store'

import { resetSelectedAccountIndex } from '@core/account/actions'
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
import { lockStronghold, resetActiveProfile } from '@core/profile/actions'
import { activeAccounts, activeProfile, isSoftwareProfile, isDestroyingManager } from '@core/profile/stores'
import { isLedgerProfile } from '@core/profile/utils'
import { clearProfileFromMemory, unsubscribeFromWalletApiEvents } from '@core/profile-manager/actions'
import { IProfileManager } from '@core/profile-manager/interfaces'
import { profileManager } from '@core/profile-manager/stores'
import { routerManager } from '@core/router/stores'
import { clearFilters } from '@core/utils/clearFilters'
import { Platform } from '@core/app'

/**
 * Logout from active profile
 */
export async function logout(clearActiveProfile = true, _lockStronghold = true): Promise<void> {
    if (get(isSoftwareProfile)) {
        _lockStronghold && lockStronghold()
    } else if (isLedgerProfile(get(activeProfile).type)) {
        Platform.killLedgerProcess()
        get(isPollingLedgerDeviceStatus) && stopPollingLedgerNanoStatus()
    }

    clearNetworkPoll()
    clearMarketPricesPoll()

    const _activeProfile = get(activeProfile)
    if (_activeProfile) {
        const manager = get(profileManager)
        await destroyWalletRsObjects(manager)
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
    await clearProfileFromMemory()
    isDestroyingManager.set(false)
}
