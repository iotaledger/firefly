import { WalletOptions, CreateAccountPayload, TransactionId, OutputId } from '@iota/wallet/out/types'
import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces'

import { IAccount } from '@core/account'

import { IProfileManager } from './profile-manager.interface'
import { RecoverAccountsPayload } from './recover-account-payload.interface'

export interface IApi {
    computeOutputId(id: TransactionId, index: number): Promise<OutputId>
    getNodeInfo(profileManagerId: string, url?: string, auth?: IAuth): Promise<INodeInfoResponse>
    generateMnemonic(): Promise<string>
    verifyMnemonic(mnemonic: string): Promise<void>
    createWallet(id: string, options: WalletOptions): Promise<IProfileManager>
    createAccount(managerId: string, payload: CreateAccountPayload): Promise<IAccount>
    deleteWallet(id: string): void
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
