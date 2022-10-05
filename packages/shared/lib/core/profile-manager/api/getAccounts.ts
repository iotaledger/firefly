import { IAccount } from '@core/account'
import { api } from './api'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function getAccounts(manager = profileManager): Promise<IAccount[]> {
    const { id } = get(manager)
    return api.getAccounts(id)
}
