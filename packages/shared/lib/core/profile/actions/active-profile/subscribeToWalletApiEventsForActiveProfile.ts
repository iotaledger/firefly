import { WalletEventType } from '@iota/sdk/out/types'
import { getSelectedWallet, handleNewOutputEvent, handleSpentOutputEvent, handleTransactionInclusionEvent, handleTransactionProgressEvent, subscribeToWalletApiEvents, WalletApiEventMap } from '@core/wallet'

export function subscribeToWalletApiEventsForActiveProfile(): void {
    const wallet = getSelectedWallet();
    const eventMap: WalletApiEventMap = {
        [WalletEventType.NewOutput]: handleNewOutputEvent,
        [WalletEventType.SpentOutput]: handleSpentOutputEvent,
        [WalletEventType.TransactionInclusion]: handleTransactionInclusionEvent,
        [WalletEventType.TransactionProgress]: handleTransactionProgressEvent,
    }
    subscribeToWalletApiEvents({
        eventMap,
        wallet,
    })
}
