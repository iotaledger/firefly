import { AccountMock } from './account.mock'
import { ProfileManagerMock } from './profile-manager.mock'

import { AccountManagerOptions, CreateAccountPayload } from '@iota/wallet'

import { IApi, RecoverAccountsPayload } from '@core/profile-manager'
import { IAccount } from '@core/account'

const profileManagers = {}

const api: IApi = {
    createAccountManager(id: string, _: AccountManagerOptions): ProfileManagerMock {
        const manager = new ProfileManagerMock(id)

        profileManagers[id] = manager

        return manager
    },
    createAccount(_: string, __: CreateAccountPayload): Promise<IAccount> {
        return new Promise((resolve) => {
            resolve(new AccountMock())
        })
    },
    deleteAccountManager(id: string) {
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
}

window['__WALLET__API__'] = api
