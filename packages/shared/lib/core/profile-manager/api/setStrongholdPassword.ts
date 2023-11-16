import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'

export async function setStrongholdPassword(password: string): Promise<void> {
    const account = get(selectedAccount)
    // Otherwise error is thrown, if password is still present in memory
    await account?.clearStrongholdPassword()
    await account?.setStrongholdPassword(password)
}
