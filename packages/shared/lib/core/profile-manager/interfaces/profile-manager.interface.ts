import { IAuth, INodeInfoResponse } from '@core/network'
import { AccountId, CreateAccountPayload, EventType } from '@iota/wallet'
import { StardustAccount } from '@lib/typings/account'

export interface IProfileManager {
    getAccount(accountId: AccountId): Promise<StardustAccount>
    getAccounts(): Promise<StardustAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse>
    createAccount(account: CreateAccountPayload): Promise<StardustAccount>
    setStrongholdPassword(password: string): Promise<string>
    generateMnemonic(): Promise<string>
    storeMnemonic(mnemonic: string): Promise<string>
    verifyMnemonic(mnemonic: string): Promise<string>
    backup(destination: string, password: string): Promise<void>
    importAccounts(backupPath: string, password: string): Promise<string>
    listen(eventTypes: EventType[], callback: (error: Error, result: string) => void): void
}
