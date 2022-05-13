import { api } from '../api'
import { profileManager } from '../store'

export function initialiseProfileManager(storagePath: string): void {
    // TODO: Set nodes based on client options?
    const newProfileManager = api.createAccountManager({
        storagePath,
        clientOptions: {
            nodes: [
                {
                    url: 'https://api.alphanet.iotaledger.net',
                    auth: null,
                    disabled: false,
                },
            ],
            localPow: true,
        },
        secretManager: {
            Stronghold: {
                password: '',
                snapshotPath: `${storagePath}/wallet.stronghold`,
            },
        },
    })
    profileManager.set(newProfileManager)
}
