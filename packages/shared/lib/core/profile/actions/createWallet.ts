import { api } from '@core/api'
import { generateRandomId } from '@core/utils'
import { get } from 'svelte/store'
import { IWallet } from '../interfaces'
import { activeProfile as activeProfileStore } from '../stores'
import { getSecretManagerFromProfileType, getStorageDirectoryOfProfile } from '../utils'
import { WalletOptions } from '@iota/sdk'
import { selectedWalletId } from '../../wallet'

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
    // const snapshotPath = ''

    const walletOptions: WalletOptions = {
        clientOptions: activeProfile.clientOptions,
        secretManager: getSecretManagerFromProfileType(activeProfile.type, storagePath),
        bipPath: {
            coinType: activeProfile.network.coinType,
            account: 0,
            addressIndex: 0
        },
        coinType: activeProfile.network.coinType
    }
    console.log("walletOptions", walletOptions);
    
    const wallet = await api.createWallet(id, {
        ...walletOptions,
        storagePath,
    })

    // TODO(2.0): Fix 
    selectedWalletId.set(id)
    console.log("wallet in createWallet", wallet);
    return wallet
}
