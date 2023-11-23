import { IAccount } from '@core/account/interfaces'
import { selectedAccount } from '@core/account/stores'
import { get, Readable } from 'svelte/store'

// TODO(2.0): Fix all of usages of this
export async function unsubscribeFromWalletApiEvents(
    wallet: Readable<IAccount | undefined> = selectedAccount
): Promise<void> {
    await get(wallet)?.clearListeners([])
}
