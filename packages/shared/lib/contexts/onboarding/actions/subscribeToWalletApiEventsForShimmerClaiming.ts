import { get } from 'svelte/store'
import { WalletEventType } from '@iota/sdk/out/types'

import { shimmerClaimingProfileManager } from '../stores'

import { handleTransactionInclusionEventForShimmerClaiming } from './handleTransactionInclusionEventForShimmerClaiming'
import { handleTransactionProgressEvent, subscribeToWalletApiEvents, WalletApiEventMap } from '@core/wallet'

// TODO(2.0) Fix
export function subscribeToWalletApiEventsForShimmerClaiming(): void {
    const profileManager = get(shimmerClaimingProfileManager)
    const eventMap: WalletApiEventMap = {
        [WalletEventType.TransactionInclusion]: handleTransactionInclusionEventForShimmerClaiming,
        [WalletEventType.TransactionProgress]: handleTransactionProgressEvent,
    }

    subscribeToWalletApiEvents({
        eventMap,
        profileManager,
    })
}
