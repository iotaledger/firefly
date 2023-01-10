import { ClientOptions, CoinType, SecretManager } from '@iota/wallet'

import { generateRandomId } from '@core/utils'

import { api } from '../api'
import { IProfileManager } from '../interfaces'

export async function initialiseProfileManager(
    storagePath: string,
    coinType: CoinType,
    clientOptions?: ClientOptions,
    secretManager?: SecretManager,
    id?: string
): Promise<IProfileManager> {
    id = id ?? generateRandomId()

    const profileManager = await api.createAccountManager(id, {
        storagePath,
        ...(clientOptions && { clientOptions }),
        coinType,
        ...(secretManager && { secretManager }),
    })
    return profileManager
}
