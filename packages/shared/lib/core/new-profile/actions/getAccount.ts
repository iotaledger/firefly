import { get } from 'svelte/store'

import { IAccount } from '@core/account'

import { api } from '../../api/api'
import { profileManager } from '../stores'

export function getAccount(index: number, manager = profileManager): Promise<IAccount> {
    const { id } = get(manager) ?? {}
    if (id) {
        return api.getAccount(id, index)
    }
}
