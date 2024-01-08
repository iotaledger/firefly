import { get } from 'svelte/store'
import { Event, NewOutputWalletEvent, WalletEventType } from '@iota/sdk'
import { activeWallets } from 'shared/lib/core/profile'
import { loadWallet, validateWalletApiEvent } from 'shared/lib/core/wallet'

export function handleNewOutputForImplicitAccountCreation(error: Error, rawEvent: Event): void {
    const { walletId, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.NewOutput)
    const type = payload.type
    if (type === WalletEventType.TransactionInclusion) {
        handleNewOutputForImplicitAccountCreationInternal(walletId, payload as NewOutputWalletEvent)
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
