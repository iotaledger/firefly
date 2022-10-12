import { IAccount } from '@core/account'
import { get } from 'svelte/store'
import { profileManager } from '../stores'
import { getAccount } from './getAccount'

export async function getAccounts(): Promise<IAccount[]> {
    const accountsResponse = await get(profileManager).getAccounts()
    const accountsPromises = accountsResponse.map((acc) => getAccount(acc.meta.index))
    return Promise.all(accountsPromises)
}
