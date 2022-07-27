import { ClientOptions, CoinType, SecretManager } from '@iota/wallet'
import { api } from '../api'
import { TimeNotSyncedError } from '../errors'
import { profileManager } from '../stores'
import { isDeviceTimeSynced } from '../utils'

export async function initialiseProfileManager(
    storagePath: string,
    coinType: CoinType,
    clientOptions?: ClientOptions,
    secretManager?: SecretManager
): Promise<void> {
    const newProfileManager = api.createAccountManager({
        storagePath,
        ...(clientOptions && { clientOptions }),
        coinType,
        ...(secretManager && { secretManager }),
    })
    profileManager.set(newProfileManager)

    if (!(await isDeviceTimeSynced())) {
        throw new TimeNotSyncedError()
    }
}
