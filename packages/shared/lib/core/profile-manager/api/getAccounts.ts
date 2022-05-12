import { StardustAccount } from '@lib/typings/account'
import { get } from 'svelte/store'
import { profileManager } from '../store'
import { getAccount } from './getAccount'

export async function getAccounts(): Promise<StardustAccount[]> {
    const accountsResponse = await get(profileManager).getAccounts()
    const accountsPromises = accountsResponse.map((acc) => getAccount(acc.meta.index))
    return Promise.all(accountsPromises)
}
