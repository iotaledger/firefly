import { AccountManagerOptions, CreateAccountPayload } from '@iota/wallet'

import { IAccount } from '@core/account'

import { IProfileManager } from './profile-manager.interface'
import { RecoverAccountsPayload } from './recover-account-payload.interface'

export interface IApi {
    createAccountManager(id: string, options: AccountManagerOptions): Promise<IProfileManager>
    createAccount(managerId: string, payload: CreateAccountPayload): Promise<IAccount>
    deleteAccountManager(id: string): void
    getAccount(profileManagerId: string, index: number): Promise<IAccount>
    getAccounts(profileManagerId: string): Promise<IAccount[]>
    recoverAccounts(profileManagerId: string, payload: RecoverAccountsPayload): Promise<IAccount[]>
    migrateStrongholdSnapshotV2ToV3(currentPath, currentPassword, newPath, newPassword): Promise<void>
}
