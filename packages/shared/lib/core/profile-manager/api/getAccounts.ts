import { IAccount } from '@core/account'
import { get } from 'svelte/store'
import { profileManager } from '../stores'
import { getAccount } from './getAccount'

export async function getAccounts(): Promise<IAccount[]> {
    const accountIndices = await get(profileManager).getAccountIndexes()
    const accountsPromises = accountIndices.map((index) => getAccount(index))
    return Promise.all(accountsPromises)
}
