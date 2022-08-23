import { get } from 'svelte/store'

import type { AccountMeta, AccountSyncOptions } from '@iota/wallet'

import { profileManager } from '../stores'

export async function recoverAccounts(
    accountGapLimit: number,
    addressGapLimit: number,
    syncOptions?: AccountSyncOptions
): Promise<AccountMeta[]> {
    const manager = get(profileManager)
    if (syncOptions) {
        return manager.recoverAccounts(accountGapLimit, addressGapLimit, syncOptions)
    } else {
        return manager.recoverAccounts(accountGapLimit, addressGapLimit)
    }
}
