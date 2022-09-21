import { get } from 'svelte/store'

import type { AccountSyncOptions } from '@iota/wallet'

import { IAccount } from '@core/account'

import { profileManager } from '../stores'

export async function recoverAccounts(
    accountGapLimit: number,
    addressGapLimit: number,
    syncOptions?: AccountSyncOptions
): Promise<IAccount[]> {
    const manager = get(profileManager)
    if (syncOptions) {
        return manager.recoverAccounts(accountGapLimit, addressGapLimit, syncOptions)
    } else {
        return manager.recoverAccounts(accountGapLimit, addressGapLimit)
    }
}
