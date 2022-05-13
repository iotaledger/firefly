import { AccountManagerOptions } from '@iota/wallet'
import { StardustAccount } from '@lib/typings/account'
import { IProfileManager } from './profile-manager.interface'

export interface IApi {
    createAccountManager(options: AccountManagerOptions): IProfileManager
    getAccount(index: number): Promise<StardustAccount>
}
