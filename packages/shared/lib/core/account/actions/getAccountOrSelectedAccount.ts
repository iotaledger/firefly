import { getAccount } from '@core/profile-manager'
import { get } from 'svelte/store'
import { IAccount } from '../interfaces'
import { selectedAccount } from '../stores'

export async function getAccountOrSelectedAccount(id?: string): Promise<IAccount> {
    if (id) {
        return getAccount(Number(id))
    } else {
        return Promise.resolve(get(selectedAccount))
    }
}
