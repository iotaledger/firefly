import { get } from 'svelte/store'

import { IAccount } from '@core/account'

import { api } from './api'
import { profileManager } from '../stores'

export function getAccount(index: number): Promise<IAccount> {
    return api.getAccount(get(profileManager)?.id, index)
}
