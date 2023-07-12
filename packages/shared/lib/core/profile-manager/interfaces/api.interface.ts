import { WalletOptions, CreateAccountPayload } from '@iota/wallet'

import { IAccount } from '@core/account'

import { IProfileManager } from './profile-manager.interface'
import { RecoverAccountsPayload } from './recover-account-payload.interface'

export interface IApi {
    // TODO-sdk: These should be renamed to createWallet etc... to match naming in sdk
    createAccountManager(id: string, options: WalletOptions): Promise<IProfileManager>
    createAccount(managerId: string, payload: CreateAccountPayload): Promise<IAccount>
    deleteAccountManager(id: string): void
    getAccount(profileManagerId: string, index: number): Promise<IAccount>
    getAccounts(profileManagerId: string): Promise<IAccount[]>
    recoverAccounts(profileManagerId: string, payload: RecoverAccountsPayload): Promise<IAccount[]>
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        currentPassword: string,
        newPath: string,
        newPassword: string
    ): Promise<void>
}
