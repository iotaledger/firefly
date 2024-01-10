import { api } from '@core/api'
import { IPersistedProfile, IWallet } from '../interfaces'
import { getSecretManagerFromProfileType, getStorageDirectoryOfProfile } from '../utils'
import { WalletOptions } from '@iota/sdk'
import { selectedWalletId } from '../../wallet'

export function getWalletOptions(profile: IPersistedProfile, storagePath: string, address: string): WalletOptions {
    return {
        address,
        clientOptions: profile.clientOptions,
        storagePath,
        secretManager: getSecretManagerFromProfileType(profile.type, storagePath),
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

interface CreateWalletOptions {
    profile: IPersistedProfile
    address: string
}

export async function createWallet({ profile, address }: CreateWalletOptions): Promise<IWallet> {
    const { id } = profile
    const storagePath = await getStorageDirectoryOfProfile(id)

    const walletOptions = getWalletOptions(profile, storagePath, address)
    const wallet = await api.createWallet(id, {
        ...walletOptions,
        storagePath,
    })

    // TODO(2.0): Fix
    selectedWalletId.set(id)
    return wallet
}
