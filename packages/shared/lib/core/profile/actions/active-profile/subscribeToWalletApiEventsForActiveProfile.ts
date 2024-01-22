import { WalletEventType } from '@iota/sdk/out/types'
import {
    getSelectedWallet,
    handleNewOutputEvent,
    handleSpentOutputEvent,
    handleTransactionInclusionEvent,
    handleTransactionProgressEvent,
    subscribeToWalletApiEvents,
    WalletApiEventMap,
} from '@core/wallet'

export function subscribeToWalletApiEventsForActiveProfile(): void {
    const wallet = getSelectedWallet()
    const eventMap: WalletApiEventMap = {
        [WalletEventType.NewOutput]: handleNewOutputEvent(wallet.id),
        [WalletEventType.SpentOutput]: handleSpentOutputEvent(wallet.id),
        [WalletEventType.TransactionInclusion]: handleTransactionInclusionEvent(wallet.id),
        [WalletEventType.TransactionProgress]: handleTransactionProgressEvent(wallet.id),
    }
    subscribeToWalletApiEvents({
        eventMap,
        wallet,
    })
}
