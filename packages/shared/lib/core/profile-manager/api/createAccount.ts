import { get, Writable } from 'svelte/store'

import { CreateAccountPayload } from '@iota/wallet/out/types'

import { IAccount } from '@core/account'

import { api, IProfileManager, profileManager } from '..'

export function createAccount(
    payload: CreateAccountPayload,
    manager: Writable<IProfileManager> = profileManager
): Promise<IAccount> {
    const { id } = get(manager)
    return api.createAccount(id, payload)
}
