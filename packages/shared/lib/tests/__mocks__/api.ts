import { AccountId, AccountManagerOptions } from '@iota/wallet'
import { IApi } from '../../core/profile-manager'
import { AccountMock } from './account.mock'
import { ProfileManagerMock } from './profileManager.mock'

const profileManagers = {}

const api: IApi = {
    createAccountManager(id: string, _: AccountManagerOptions): ProfileManagerMock {
        const manager = new ProfileManagerMock(id)

        profileManagers[id] = manager

        return manager
    },
    deleteAccountManager(id: string) {
        if (id && id in profileManagers) {
            delete profileManagers[id]
        }
    },
    getAccount(_: AccountId): Promise<AccountMock> {
        return new Promise((resolve) => {
            resolve(new AccountMock())
        })
    },
}

window['__WALLET__API__'] = api
