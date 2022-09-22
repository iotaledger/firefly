import { get } from 'svelte/store'

import type { AccountMeta, AccountSyncOptions } from '@iota/wallet'

import { profileManager } from '../stores'

export async function recoverAccounts(
    accountStartIndex: number,
    accountGapLimit: number,
    addressGapLimit: number,
    syncOptions?: AccountSyncOptions
): Promise<AccountMeta[]> {
    const manager = get(profileManager)
    if (syncOptions) {
        return manager.recoverAccounts(accountStartIndex, accountGapLimit, addressGapLimit, syncOptions)
    } else {
        return manager.recoverAccounts(accountStartIndex, accountGapLimit, addressGapLimit)
    }
}
