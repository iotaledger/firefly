import { get } from 'svelte/store'
import { WalletEventType } from '@iota/sdk/out/types'

import { handleTransactionProgressEvent, subscribeToWalletApiEvents, WalletApiEventMap } from '@core/profile-manager'

import { shimmerClaimingProfileManager } from '../stores'

import { handleTransactionInclusionEventForShimmerClaiming } from './handleTransactionInclusionEventForShimmerClaiming'

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
