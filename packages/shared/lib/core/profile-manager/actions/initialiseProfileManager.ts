import { ClientOptions, CoinType, SecretManager } from '@iota/wallet'

import { generateRandomId } from '@lib/utils'

import { api } from '../api'
import { IProfileManager } from '../interfaces'

export function initialiseProfileManager(
    storagePath: string,
    coinType: CoinType,
    clientOptions?: ClientOptions,
    secretManager?: SecretManager,
    id?: string
): IProfileManager {
    id = id ?? generateRandomId()
    return api.createAccountManager(id, {
        storagePath,
        ...(clientOptions && { clientOptions }),
        coinType,
        ...(secretManager && { secretManager }),
    })
}
