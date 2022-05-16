import { IAuth, INodeInfoResponse } from '@core/network'
import { AccountId, AccountSyncOptions, ClientOptions, CreateAccountPayload, EventType } from '@iota/wallet'
import { StardustAccount } from '@lib/typings/account'

export interface IProfileManager {
    getAccount(accountId: AccountId): Promise<StardustAccount>
    getAccounts(): Promise<StardustAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse>
    createAccount(account: CreateAccountPayload): Promise<StardustAccount>
    deleteStorage(): Promise<void>
    setStrongholdPassword(password: string): Promise<void>
    generateMnemonic(): Promise<string>
    storeMnemonic(mnemonic: string): Promise<void>
    verifyMnemonic(mnemonic: string): Promise<void>
    backup(destination: string, password: string): Promise<void>
    restoreBackup(source: string, password: string): Promise<void>
    listen(eventTypes: EventType[], callback: (error: Error, result: string) => void): void
    recoverAccounts(accountGapLimit: number, addressGapLimit: number): Promise<StardustAccount[]>
    setClientOptions(options: ClientOptions): Promise<void>
    startBackgroundSync(options?: AccountSyncOptions, interval?: number): Promise<void>
    stopBackgroundSync(): Promise<void>
}
