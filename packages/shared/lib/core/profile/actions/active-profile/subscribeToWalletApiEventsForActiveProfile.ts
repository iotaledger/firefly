import { get } from 'svelte/store'

import {
    handleNewOutputEvent,
    handleSpentOutputEvent,
    handleTransactionInclusionEvent,
    handleTransactionProgressEvent,
    profileManager as _profileManager,
    subscribeToWalletApiEvents,
    WalletApiEvent,
    WalletApiEventMap,
} from '@core/profile-manager'

export function subscribeToWalletApiEventsForActiveProfile(): void {
    const profileManager = get(_profileManager)
    const eventMap: WalletApiEventMap = {
        [WalletApiEvent.NewOutput]: handleNewOutputEvent,
        [WalletApiEvent.SpentOutput]: handleSpentOutputEvent,
        [WalletApiEvent.TransactionInclusion]: handleTransactionInclusionEvent,
        [WalletApiEvent.TransactionProgress]: handleTransactionProgressEvent,
    }
    subscribeToWalletApiEvents({
        eventMap,
        profileManager,
    })
}
