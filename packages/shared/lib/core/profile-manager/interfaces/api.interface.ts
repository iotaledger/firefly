import { IAccount } from '@core/account'
import { AccountManagerOptions } from '@iota/wallet'
import { IProfileManager } from './profile-manager.interface'

export interface IApi {
    createAccountManager(options: AccountManagerOptions): IProfileManager
    getAccount(index: number): Promise<IAccount>
}
