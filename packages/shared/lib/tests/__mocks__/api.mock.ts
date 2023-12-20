import { WalletMock } from './wallet.mock'
import { WalletOptions } from '@iota/sdk/out/types'
import { IApi } from '../../core/api'

export const MOCK_MNEMONIC =
    'term aisle loyal cradle talent buddy crater express asthma load antique game better head position master aspect print more wine sword speed joy story'

const wallets = {}

const api = {
    async createWallet(id: string, _: WalletOptions): Promise<WalletMock> {
        const wallet = new WalletMock(id)

        wallets[id] = wallet

        return wallet
    },
    deleteWallet(id: string) {
        if (id && id in wallets) {
            delete wallets[id]
        }
    },
    getWallet(id: string): Promise<WalletMock> {
        if (wallets[id]) return Promise.resolve(wallets[id])
        const wallet = new WalletMock(id)
        wallets[id] = wallet
        return Promise.resolve(wallet)
    },
    migrateStrongholdSnapshotV2ToV3(
        _currentPath: string,
        _newPath: string,
        _currentPassword: string,
        _newPassword: string
    ): Promise<void> {
        return new Promise((resolve) => {
            resolve()
        })
    },

    generateMnemonic(): Promise<string> {
        return Promise.resolve(MOCK_MNEMONIC)
    },

    verifyMnemonic(mnemonic: string): Promise<void> {
        return Promise.resolve()
    },
} as unknown as IApi

window['__WALLET__API__'] = api
