import { WALLET_STARDUST } from '@lib/shell/walletApi'
import { ProfileManager } from '@lib/typings/profileManager'
import { profileManager } from '../store'

const { createAccountManager } = WALLET_STARDUST

export function initialiseProfileManager(storagePath: string): void {
    // TODO: Set nodes based on client options?
    const newProfileManager: ProfileManager = createAccountManager({
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
                snapshotPath: `${storagePath}/wallet.stronghold`,
            },
        },
    })
    profileManager.set(newProfileManager)
}
