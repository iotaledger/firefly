import { StardustAccount } from '@lib/typings/account'
import { getStardustAccount } from '@lib/wallet'
import { get } from 'svelte/store'
import { profileManager } from '../store'

export async function getAccounts(): Promise<StardustAccount[]> {
    const accountsResponse = await get(profileManager).getAccounts()
    const accountsPromises = accountsResponse.map((acc) => getStardustAccount(acc.meta.index))
    return Promise.all(accountsPromises)
}
