import type {
    IClientOptions,
    GenerateAddressOptions,
    LedgerNanoStatus,
    INodeInfoWrapper,
    SyncOptions,
    WalletEvent,
    WalletEventType,
} from '@iota/sdk/out/types'

import { IAccount } from '@core/account/interfaces'
import { IAuth } from '@core/network/interfaces'

import { WalletApiEventHandler } from '../types'

export interface IProfileManager {
    id: string
    getSecretManagerOptions(): any, // TODO: Use proper type
    backup(destination: string, password: string): Promise<void>
    bech32ToHex(bech32Address: string): Promise<string>
    destroy(): Promise<void>
    emitTestEvent(event: WalletEvent): Promise<void>
    generateEd25519Address(
        accountIndex: number,
        options?: GenerateAddressOptions,
        bech32Hrp?: string
    ): Promise<string>
    getAccountIndexes(): Promise<number[]>
    getAccount(accountIndex: number): Promise<IAccount>
    getAccounts(): Promise<IAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoWrapper>
    getLedgerNanoStatus(): Promise<LedgerNanoStatus>
    hexToBech32(hex: string, bech32Hrp?: string): Promise<string>
    listen(eventTypes: WalletEventType[], callback: WalletApiEventHandler): Promise<void>
    clearListeners(eventTypes: WalletEventType[]): Promise<void>
    removeLatestAccount(): Promise<void>
    restoreBackup(
        source: string,
        password: string,
        ignoreIfCoinTypeMismatch: boolean,
        ignoreIfBech32Mismatch: string
    ): Promise<void>
    setClientOptions(options: IClientOptions): Promise<void>
    startBackgroundSync(options?: SyncOptions, intervalInMilliseconds?: number): Promise<void>
    stopBackgroundSync(): Promise<void>
    storeMnemonic(mnemonic: string): Promise<void>
    updateNodeAuth(url: string, auth?: IAuth): Promise<void>
}
