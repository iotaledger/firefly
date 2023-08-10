import { WalletOptions, CreateAccountPayload, TransactionId, OutputId } from '@iota/sdk/out/types'
import { AliasId, Client, FoundryId } from '@iota/sdk'
import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces'

import { IAccount } from '@core/account'

import { IProfileManager } from './profile-manager.interface'
import { RecoverAccountsPayload } from './recover-account-payload.interface'

export interface IApi {
    getNodeInfo(profileManagerId: string, url?: string, auth?: IAuth): Promise<INodeInfoResponse>
    createWallet(id: string, options: WalletOptions): Promise<IProfileManager>
    createAccount(managerId: string, payload: CreateAccountPayload): Promise<IAccount>
    deleteWallet(id: string): void
    getAccount(profileManagerId: string, index: number): Promise<IAccount>
    getAccounts(profileManagerId: string): Promise<IAccount[]>
    getClient(profileManagerId: string): Promise<Client>
    recoverAccounts(profileManagerId: string, payload: RecoverAccountsPayload): Promise<IAccount[]>
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        currentPassword: string,
        newPath: string,
        newPassword: string
    ): Promise<void>
    // Mapped from sdk#Utils
    generateMnemonic(): Promise<string>
    verifyMnemonic(mnemonic: string): Promise<void>
    computeOutputId(id: TransactionId, index: number): Promise<OutputId>
    computeFoundryId(aliasId: AliasId, serialNumber: number, tokenSchemeType: number): Promise<FoundryId>
}
