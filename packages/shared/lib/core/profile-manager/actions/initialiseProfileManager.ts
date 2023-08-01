import { IClientOptions, SecretManagerType } from '@iota/wallet/out/types'
import { CoinType } from '@iota/wallet/out/types'

import { generateRandomId } from '@core/utils'

import { api } from '../api'
import { IProfileManager } from '../interfaces'

export async function initialiseProfileManager(
    storagePath: string,
    coinType: CoinType,
    clientOptions?: IClientOptions,
    secretManager?: SecretManagerType,
    id?: string
): Promise<IProfileManager> {
    id = id ?? generateRandomId()

    const profileManager = await api.createWallet(id, {
        storagePath,
        clientOptions,
        coinType,
        secretManager,
    })
    return profileManager
}
