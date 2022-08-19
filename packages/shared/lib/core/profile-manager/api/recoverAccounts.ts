import { get } from 'svelte/store'

import { AccountMeta } from '@iota/wallet'

import { profileManager } from '../stores'

export async function recoverAccounts(accountGapLimit: number, addressGapLimit: number): Promise<AccountMeta[]> {
    const manager = get(profileManager)
    return manager.recoverAccounts(accountGapLimit, addressGapLimit)
}
