import { AccountId, AccountManagerOptions } from '@iota/wallet'
import { AccountMock } from './account.mock'
import { ProfileManagerMock } from './profileManager.mock'

interface IStardustApi {
    createAccountManager(options: AccountManagerOptions): ProfileManagerMock
    getAccount(accountId: string): Promise<AccountMock>
}
const stardustApi: IStardustApi = {
    createAccountManager(_: AccountManagerOptions): ProfileManagerMock {
        return new ProfileManagerMock()
    },
    getAccount(_: AccountId): Promise<AccountMock> {
        return new Promise((resolve) => {
            resolve(new AccountMock())
        })
    },
}

window['__WALLET__STARDUST__'] = stardustApi
