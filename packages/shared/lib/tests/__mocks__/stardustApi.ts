import { AccountManagerOptions } from '@iota/wallet'
import Account from './account.mock'
import { AccountManager } from './accountManager.mock'
jest.mock('@iota/wallet')

interface IStardustApi {
    createAccountManager(options: AccountManagerOptions): AccountManager
    getAccount(accountId: string): Promise<Account>
}
const stardustApi: IStardustApi = {
    createAccountManager(options: AccountManagerOptions): AccountManager {
        return new AccountManager()
    },
    getAccount(index): Promise<Account> {
        return new Promise((resolve) => {
            resolve(new Account())
        })
    },
}

window['__WALLET__STARDUST__'] = stardustApi
