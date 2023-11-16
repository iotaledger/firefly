import { AccountMock } from './account.mock'
import { ProfileManagerMock } from './profile-manager.mock'

import { WalletOptions, CreateAccountPayload } from '@iota/sdk/out/types'

import { IApi, RecoverAccountsPayload } from '@core/profile-manager'
import { IAccount } from '@core/account'

export const MOCK_MNEMONIC =
    'term aisle loyal cradle talent buddy crater express asthma load antique game better head position master aspect print more wine sword speed joy story'

const profileManagers = {}

const api: IApi = {
    createAccount(_: string, __: CreateAccountPayload): Promise<IAccount> {
        return new Promise((resolve) => {
            resolve(new AccountMock())
        })
    },
    deleteWallet(id: string) {
        if (id && id in profileManagers) {
            delete profileManagers[id]
        }
    },
    getAccount(_: string, __: number): Promise<AccountMock> {
        return new Promise((resolve) => {
            resolve(new AccountMock())
        })
    },
    getAccounts(_: string): Promise<AccountMock[]> {
        return new Promise((resolve) => {
            resolve([])
        })
    },
    recoverAccounts(_: string, __: RecoverAccountsPayload): Promise<IAccount[]> {
        return new Promise((resolve) => {
            resolve([])
        })
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
}

window['__WALLET__API__'] = api
