import { AccountId, AccountManagerOptions } from '@iota/wallet'
import Account from './account.mock'
import ProfileManagerMock from './profileManager.mock'

interface IStardustApi {
    createAccountManager(options: AccountManagerOptions): ProfileManagerMock
    getAccount(accountId: string): Promise<Account>
}
const stardustApi: IStardustApi = {
    createAccountManager(_: AccountManagerOptions): ProfileManagerMock {
        return new ProfileManagerMock()
    },
    getAccount(_: AccountId): Promise<Account> {
        return new Promise((resolve) => {
            resolve(new Account())
        })
    },
}

window['__WALLET__STARDUST__'] = stardustApi
