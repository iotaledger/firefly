import { api } from '@core/api'
import { IPersistedProfile, IWallet } from '../interfaces'
import { getSecretManagerFromProfileType, getStorageDirectoryOfProfile } from '../utils'
import { WalletOptions } from '@iota/sdk'
import { selectedWalletId } from '../../wallet'

export function getWalletOptions(profile: IPersistedProfile, storagePath: string, password?: string): WalletOptions {
    return {
        clientOptions: profile.clientOptions,
        storagePath,
        secretManager: getSecretManagerFromProfileType(profile.type, storagePath, password),
        bipPath: {
            coinType: profile.network.coinType,
            account: 0,
            addressIndex: 0,
        },
    }
}

// TODO(2.0): Fix and finish this method
/* - __storage__/
    - profile_id_1
        - secret manager
        - __wallet1__/
        - __wallet2__/
*/

export async function createWallet(profile: IPersistedProfile, password?: string): Promise<IWallet> {
    const storagePath = await getStorageDirectoryOfProfile(profile.id)

    const walletOptions = getWalletOptions(profile, storagePath, password)
    const wallet = await api.createWallet(profile.id, {
        ...walletOptions,
        storagePath,
    })

    selectedWalletId.set(profile.id)
    return wallet
}
