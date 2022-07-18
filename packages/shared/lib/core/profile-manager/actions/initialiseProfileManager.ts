import { Writable } from 'svelte/store'

import { ClientOptions, CoinType, SecretManager } from '@iota/wallet'

import { generateRandomId } from '@lib/utils'

import { api } from '../api'
import { IProfileManager } from '../interfaces'
import { profileManager } from '../stores'

export function initialiseProfileManager(
    storagePath: string,
    coinType: CoinType,
    clientOptions?: ClientOptions,
    secretManager?: SecretManager,
    profileManagerStore: Writable<IProfileManager> = profileManager
): void {
    const id = generateRandomId()
    const newProfileManager = api.createAccountManager(id, {
        storagePath,
        ...(clientOptions && { clientOptions }),
        coinType,
        ...(secretManager && { secretManager }),
    })
    profileManagerStore.set(newProfileManager)
}
