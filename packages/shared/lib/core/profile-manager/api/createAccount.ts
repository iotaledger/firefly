import { get, Writable } from 'svelte/store'

import { CreateAccountPayload } from '@iota/wallet'

import { api, IProfileManager, profileManager } from '../'

import { IAccount } from '@core/account'

export function createAccount(
    payload: CreateAccountPayload,
    manager: Writable<IProfileManager> = profileManager
): Promise<IAccount> {
    const $manager = get(manager)
    return api.createAccount($manager.id, payload)
}
