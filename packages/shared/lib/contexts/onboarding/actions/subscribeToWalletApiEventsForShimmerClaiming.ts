import { get } from 'svelte/store'

import {
    handleTransactionProgressEvent,
    subscribeToWalletApiEvents,
    WalletApiEvent,
    WalletApiEventMap,
} from '@core/profile-manager'

import { shimmerClaimingProfileManager } from '../stores'

import { handleTransactionInclusionEventForShimmerClaiming } from './handleTransactionInclusionEventForShimmerClaiming'

export function subscribeToWalletApiEventsForShimmerClaiming(): void {
    const profileManager = get(shimmerClaimingProfileManager)
    const eventMap: WalletApiEventMap = {
        [WalletApiEvent.TransactionInclusion]: handleTransactionInclusionEventForShimmerClaiming,
        [WalletApiEvent.TransactionProgress]: handleTransactionProgressEvent,
    }

    subscribeToWalletApiEvents({
        eventMap,
        profileManager,
    })
}
