import { api } from '@core/api'
import { generateRandomId } from '@core/utils'
import { get } from 'svelte/store'
import { IProfile, IWallet } from '../interfaces'
import { activeProfile as activeProfileStore } from '../stores'
import { getSecretManagerFromProfileType, getStorageDirectoryOfProfile } from '../utils'
import { Wallet, WalletOptions } from '@iota/sdk'
import { selectedWalletId } from '../../wallet'

export function getWalletOptions(profile: IProfile, storagePath:string): WalletOptions {
    const walletOptions: WalletOptions = {
        clientOptions: profile.clientOptions,
        storagePath,
        secretManager: getSecretManagerFromProfileType(profile.type, storagePath),
        bipPath: {
            coinType: profile.network.coinType,
            account: 0,
            addressIndex: 0
        },
    }

    return walletOptions
}

// TODO(2.0): Fix and finish this method
/* - __storage__/
    - profile_id_1
        - secret manager
        - __wallet1__/
        - __wallet2__/
*/
export async function createWallet(activeProfile = get(activeProfileStore)): Promise<IWallet> {
    const id = activeProfile.id;
    const storagePath = await getStorageDirectoryOfProfile(id)

    const walletOptions = getWalletOptions(activeProfile, storagePath);
    
    const wallet = await api.createWallet(id, {
        ...walletOptions,
        storagePath,
    })

    // TODO(2.0): Fix 
    selectedWalletId.set(id)
    return wallet
}
