import type {
    AccountSyncOptions,
    ClientOptions,
    Event,
    EventId,
    EventType,
    LedgerNanoStatus,
    Node,
    NodeInfoWrapper,
    WalletEvent,
} from '@iota/wallet'

import { IAuth } from '@core/network'

import { WalletApiEventHandler } from '../types'
import { IAccount } from '@core/account'

export interface IProfileManager {
    id: string
    backup(destination: string, password: string): Promise<void>
    bech32ToHex(bech32Address: string): Promise<string>
    changeStrongholdPassword(currentPassword: string, newPassword: string): Promise<void>
    clearStrongholdPassword(): Promise<void>
    destroy(): void
    deregisterParticipationEvent(eventId: EventId): Promise<void>
    emitTestEvent(event: WalletEvent): Promise<void>
    generateMnemonic(): Promise<string>
    getAccountIndexes(): Promise<number[]>
    getAccount(accountIndex: number): Promise<IAccount>
    getAccounts(): Promise<IAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<NodeInfoWrapper>
    getLedgerNanoStatus(): Promise<LedgerNanoStatus>
    hexToBech32(hex: string, bech32Hrp?: string): Promise<string>
    isStrongholdPasswordAvailable(): Promise<boolean>
    listen(eventTypes: EventType[], callback: WalletApiEventHandler): void
    clearListeners(eventTypes: EventType[]): void
    registerParticipationEvent(eventId: EventId, nodes: Node[]): Promise<Event>
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
