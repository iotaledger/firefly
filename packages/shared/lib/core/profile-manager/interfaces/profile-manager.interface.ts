import { IAccount } from '@core/account'
import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces/node-info-response.interface'
import {
    AccountId,
    AccountSyncOptions,
    ClientOptions,
    CreateAccountPayload,
    EventType,
    WalletEvent,
} from '@iota/wallet'

export interface IProfileManager {
    backup(destination: string, password: string): Promise<void>
    clearStrongholdPassword(): Promise<void>
    createAccount(account: CreateAccountPayload): Promise<IAccount>
    deleteStorage(): Promise<void>
    destroy(): void
    generateMnemonic(): Promise<string>
    getAccount(accountId: AccountId): Promise<IAccount>
    getAccounts(): Promise<IAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse>
    isStrongholdPasswordAvailable(): Promise<boolean>
    listen(eventTypes: WalletEvent[], callback: (error: Error, result: string) => void): void
    recoverAccounts(accountGapLimit: number, addressGapLimit: number): Promise<IAccount[]>
    restoreBackup(source: string, password: string): Promise<void>
    setClientOptions(options: ClientOptions): Promise<void>
    setStrongholdPassword(password: string): Promise<void>
    startBackgroundSync(options?: AccountSyncOptions, interval?: number): Promise<void>
    stopBackgroundSync(): Promise<void>
    storeMnemonic(mnemonic: string): Promise<void>
    verifyMnemonic(mnemonic: string): Promise<void>
}
