import { IClientOptions, SecretManager } from '@iota/wallet/out/types'
import { CoinType } from '@iota/wallet/out/types'

import { generateRandomId } from '@core/utils'

import { api } from '../api'
import { IProfileManager } from '../interfaces'

export async function initialiseProfileManager(
    storagePath: string,
    coinType: CoinType,
    clientOptions?: IClientOptions,
    secretManager?: SecretManager,
    id?: string
): Promise<IProfileManager> {
    id = id ?? generateRandomId()

    const profileManager = await api.createAccountManager(id, {
        storagePath,
        // TODO-sdk is this the right fix for the line ?
        // ...(clientOptions && (clientOptions?.nodes?.length > 0 || clientOptions?.primaryNode) && { clientOptions }),
        ...clientOptions,
        coinType,
        // TODO-sdk is this the right fix for the line ?
        // ...(secretManager && { secretManager }),
        ...secretManager,
    })
    return profileManager
}
