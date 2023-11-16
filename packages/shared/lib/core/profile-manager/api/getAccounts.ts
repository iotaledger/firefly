import { IAccount } from '@core/account'
import { api } from './api'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function getAccounts(): Promise<IAccount[]> {
    const manager = get(profileManager)
    return api.getAccounts(manager.id, {
        ...manager
    })
}
