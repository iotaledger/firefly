import { AccountId, AccountManagerOptions } from '@iota/wallet'

import { IApi } from '@core/profile-manager'

import { AccountMock } from './account.mock'
import { ProfileManagerMock } from './profile-manager.mock'

const api: IApi = {
    createAccountManager(_: AccountManagerOptions): ProfileManagerMock {
        return new ProfileManagerMock()
    },
    getAccount(_: AccountId): Promise<AccountMock> {
        return new Promise((resolve) => {
            resolve(new AccountMock())
        })
    },
}

window['__WALLET__API__'] = api
