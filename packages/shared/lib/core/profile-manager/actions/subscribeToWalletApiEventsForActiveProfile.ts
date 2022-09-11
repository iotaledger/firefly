import { get } from 'svelte/store'

import { profileManager as _profileManager } from '../stores'
import { WalletApiEvent } from '../enums'
import {
    handleNewOutputEvent,
    handleSpentOutputEvent,
    handleTransactionInclusionEvent,
    handleTransactionProgressEvent,
} from '../helpers'
import { subscribeToWalletApiEvents, WalletApiEventMap } from '@core/profile-manager'

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
