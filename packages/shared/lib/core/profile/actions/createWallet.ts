import { api } from '@core/api'
import { generateRandomId } from '@core/utils'
import { get } from 'svelte/store'
import { IWallet } from '../interfaces'
import { activeProfile as activeProfileStore } from '../stores'
import { getStorageDirectoryOfProfile } from '../utils'

// TODO(2.0): Fix and finish this method
/* - __storage__/
    - profile_id_1
        - secret manager
        - __wallet1__/
        - __wallet2__/
*/
export async function createWallet(): Promise<IWallet> {
    const id = generateRandomId()
    const storagePath = await getStorageDirectoryOfProfile(id)
    const snapshotPath = ''

    const activeProfile = get(activeProfileStore)

    const walletOptions = {
        clientOptions: activeProfile.clientOptions,
        secretManager: {
            stronghold: {
                snapshotPath,
            },
        },
    }
    const wallet = await api.createWallet(id, {
        ...walletOptions,
        storagePath,
    })

    return wallet
}
