import { ClientOptions, CoinType, SecretManager } from '@iota/wallet'
import { api } from '../api'
import { profileManager } from '../stores'

export function initialiseProfileManager(
    storagePath: string,
    coinType: CoinType,
    clientOptions?: ClientOptions,
    secretManager?: SecretManager
): void {
    const newProfileManager = api.createAccountManager({
        storagePath,
        ...(clientOptions && { clientOptions }),
        coinType,
        ...(secretManager && { secretManager }),
    })
    profileManager.set(newProfileManager)
}
