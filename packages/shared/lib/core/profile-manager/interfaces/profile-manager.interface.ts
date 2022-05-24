import { IAccount } from '@core/account'
import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces/node-info-response.interface'
import { AccountId, AccountSyncOptions, ClientOptions, CreateAccountPayload, EventType } from '@iota/wallet'

export interface IProfileManager {
    getAccount(accountId: AccountId): Promise<IAccount>
    getAccounts(): Promise<IAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse>
    createAccount(account: CreateAccountPayload): Promise<IAccount>
    deleteStorage(): Promise<void>
    destroy(): void
    setStrongholdPassword(password: string): Promise<void>
    generateMnemonic(): Promise<string>
    storeMnemonic(mnemonic: string): Promise<void>
    verifyMnemonic(mnemonic: string): Promise<void>
    backup(destination: string, password: string): Promise<void>
    restoreBackup(source: string, password: string): Promise<void>
    listen(eventTypes: EventType[], callback: (error: Error, result: string) => void): void
    recoverAccounts(accountGapLimit: number, addressGapLimit: number): Promise<IAccount[]>
    setClientOptions(options: ClientOptions): Promise<void>
    startBackgroundSync(options?: AccountSyncOptions, interval?: number): Promise<void>
    stopBackgroundSync(): Promise<void>
}
