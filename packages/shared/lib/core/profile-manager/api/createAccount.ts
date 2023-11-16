import { get, Writable } from 'svelte/store'

import { CreateAccountPayload } from '@iota/sdk/out/types'

import { IAccount } from '@core/account'

import { api, IProfileManager, profileManager } from '..'
import { generateRandomId } from '@core/utils'

export function createAccount(
    payload: CreateAccountPayload,
    manager: Writable<IProfileManager> = profileManager
): Promise<IAccount> {
    const profileManager = get(manager)
    const id = `${profileManager.id}-0`;
    return api.createAccount(id, {
        ...payload,
        ...profileManager.getSecretManagerOptions()
    })
}
