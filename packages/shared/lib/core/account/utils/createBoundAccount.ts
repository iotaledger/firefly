import { get, Writable } from 'svelte/store'

import { CreateAccountPayload } from '@iota/wallet'

import { api, IProfileManager, profileManager } from '@core/profile-manager'

import { IAccount } from '../interfaces'

export async function createBoundAccount(
    payload: CreateAccountPayload,
    manager: Writable<IProfileManager> = profileManager
): Promise<IAccount> {
    const unboundAccount = await get(manager)?.createAccount(payload)
    return api?.getAccount(get(manager)?.id, unboundAccount?.meta?.index)
}
