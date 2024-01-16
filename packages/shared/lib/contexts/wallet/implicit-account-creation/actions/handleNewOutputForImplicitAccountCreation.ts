import { get } from 'svelte/store'
import { WalletEvent, NewOutputWalletEvent, WalletEventType } from '@iota/sdk/out/types'
import { activeWallets } from '@core/profile'
import { WalletApiEventHandler, loadWallet, validateWalletApiEvent } from '@core/wallet'

export function handleNewOutputForImplicitAccountCreation(walletId: string): WalletApiEventHandler {
    return (error: Error, rawEvent: WalletEvent) => {
        validateWalletApiEvent(error, rawEvent, WalletEventType.NewOutput)
        if (rawEvent.type === WalletEventType.TransactionInclusion) {
            handleNewOutputForImplicitAccountCreationInternal(walletId, rawEvent as NewOutputWalletEvent)
        }
    }
}

export async function handleNewOutputForImplicitAccountCreationInternal(
    walletId: string,
    payload: NewOutputWalletEvent
): Promise<void> {
    const wallet = get(activeWallets)?.find((wallet) => wallet.id === walletId)
    const outputData = payload.output
    // TODO: Check if the outputData is the implicit account output or account output type

    if (!wallet || !outputData) return
    await loadWallet(wallet)
}
