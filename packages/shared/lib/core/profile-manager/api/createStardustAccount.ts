import { IAccount } from '@core/account'
import { CreateAccountPayload } from '@iota/wallet'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function createStardustAccount(payload: CreateAccountPayload): Promise<IAccount> {
    const manager = get(profileManager)

    return manager.createAccount(payload)
}
