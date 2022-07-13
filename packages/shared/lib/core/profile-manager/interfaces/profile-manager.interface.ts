import { IAccount } from '@core/account'
import { IAuth } from '@core/network'
import {
    AccountId,
    AccountSyncOptions,
    ClientOptions,
    CreateAccountPayload,
    EventType,
    LedgerStatus,
    NodeInfoWrapper,
    WalletEvent,
} from '@iota/wallet'

export interface IProfileManager {
    backup(destination: string, password: string): Promise<void>
    bech32ToHex(bech32Address: string): Promise<string>
    changeStrongholdPassword(currentPassword: string, newPassword: string): Promise<void>
    clearStrongholdPassword(): Promise<void>
    createAccount(payload: CreateAccountPayload): Promise<IAccount>
    deleteAccountsAndDatabase(): Promise<void>
    destroy(): void
    emitTestEvent(event: WalletEvent): Promise<void>
    generateMnemonic(): Promise<string>
    getAccount(accountId: AccountId): Promise<IAccount>
    getAccounts(): Promise<IAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<NodeInfoWrapper>
    getLedgerStatus(): Promise<LedgerStatus>
    hexToBech32(hex: string, bech32Hrp?: string): Promise<string>
    isStrongholdPasswordAvailable(): Promise<boolean>
    listen(eventTypes: EventType[], callback: (error: Error, result: string) => void): void
    clearListeners(eventTypes: EventType[]): void
    recoverAccounts(accountGapLimit: number, addressGapLimit: number): Promise<IAccount[]>
    removeLatestAccount(): Promise<void>
    restoreBackup(source: string, password: string): Promise<void>
    setClientOptions(options: ClientOptions): Promise<void>
    setStrongholdPassword(password: string): Promise<void>
    setStrongholdPasswordClearInterval(intervalInMilliseconds?: number): Promise<void>
    startBackgroundSync(options?: AccountSyncOptions, intervalInMilliseconds?: number): Promise<void>
    stopBackgroundSync(): Promise<void>
    storeMnemonic(mnemonic: string): Promise<void>
    verifyMnemonic(mnemonic: string): Promise<void>
}
