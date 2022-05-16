import { getOfficialNodes, NetworkProtocol, NetworkType } from '@core/network'
import { buildClientOptions } from '@core/network/helpers'
import { ClientOptions } from '@iota/wallet'
import { api } from '../api'
import { profileManager } from '../store'

export function initialiseProfileManager(storagePath: string, clientOptions?: ClientOptions): void {
    const newProfileManager = api.createAccountManager({
        storagePath,
        clientOptions,
        secretManager: {
            Stronghold: {
                password: '',
                snapshotPath: `${storagePath}/wallet.stronghold`,
            },
        },
    })
    profileManager.set(newProfileManager)
}
