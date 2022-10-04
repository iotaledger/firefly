import {
    AccountId,
    AccountSyncOptions,
    ClientOptions,
    CreateAccountPayload,
    EventType,
    LedgerNanoStatus,
    NodeInfoWrapper,
    WalletEvent,
} from '@iota/wallet'

import { IAccount } from '@core/account'
import { IAuth } from '@core/network'

import { WalletApiEventHandler } from '../types'

export interface IProfileManager {
    id: string
    backup(destination: string, password: string): Promise<void>
    bech32ToHex(bech32Address: string): Promise<string>
    changeStrongholdPassword(currentPassword: string, newPassword: string): Promise<void>
    clearStrongholdPassword(): Promise<void>
    createAccount(payload: CreateAccountPayload): Promise<IAccount>
    destroy(): void
    emitTestEvent(event: WalletEvent): Promise<void>
    generateMnemonic(): Promise<string>
    getAccount(accountId: AccountId): Promise<IAccount>
    getAccountIndexes(): Promise<number[]>
    getAccounts(): Promise<IAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<NodeInfoWrapper>
    getLedgerNanoStatus(): Promise<LedgerNanoStatus>
    hexToBech32(hex: string, bech32Hrp?: string): Promise<string>
    isStrongholdPasswordAvailable(): Promise<boolean>
    listen(eventTypes: EventType[], callback: WalletApiEventHandler): void
    clearListeners(eventTypes: EventType[]): void
    recoverAccounts(
        accountStartIndex: number,
        accountGapLimit: number,
        addressGapLimit: number,
        syncOptions?: AccountSyncOptions
    ): Promise<IAccount[]>
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
