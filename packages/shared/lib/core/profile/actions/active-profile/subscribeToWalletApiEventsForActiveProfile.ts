import { get } from 'svelte/store'
import { WalletEventType } from '@iota/wallet/out/types'

import {
    handleNewOutputEvent,
    handleSpentOutputEvent,
    handleTransactionInclusionEvent,
    handleTransactionProgressEvent,
    profileManager as _profileManager,
    subscribeToWalletApiEvents,
    WalletApiEventMap,
} from '@core/profile-manager'

export function subscribeToWalletApiEventsForActiveProfile(): void {
    const profileManager = get(_profileManager)
    const eventMap: WalletApiEventMap = {
        [WalletEventType.NewOutput]: handleNewOutputEvent,
        [WalletEventType.SpentOutput]: handleSpentOutputEvent,
        [WalletEventType.TransactionInclusion]: handleTransactionInclusionEvent,
        [WalletEventType.TransactionProgress]: handleTransactionProgressEvent,
    }
    subscribeToWalletApiEvents({
        eventMap,
        profileManager,
    })
}
