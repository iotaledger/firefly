import { get } from 'svelte/store'
import { profileManager } from '../stores'
import { IAccount } from '@core/account'

export async function recoverAccounts(accountGapLimit: number, addressGapLimit: number): Promise<IAccount[]> {
    const manager = get(profileManager)
    return manager.recoverAccounts(accountGapLimit, addressGapLimit)
}
