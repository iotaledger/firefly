import { AccountMock } from './account.mock'

import type {
    AccountId,
    CreateAccountPayload,
    SyncOptions,
    ClientOptions,
    WalletEvent,
    LedgerNanoStatus,
    GenerateAddressOptions,
    INode,
} from '@iota/wallet/out/types'
import { WalletEventType } from '@iota/wallet/out/types'

import { IAccount } from '@core/account'
import { IAuth, INodeInfoResponse } from '@core/network'
import { IProfileManager, WalletApiEventHandler } from '@core/profile-manager'

export const MOCK_MNEMONIC =
    'term aisle loyal cradle talent buddy crater express asthma load antique game better head position master aspect print more wine sword speed joy story'

export class ProfileManagerMock implements IProfileManager {
    id: string

    constructor(id: string) {
        this.id = id
    }

    backup(_: string, __: string): Promise<void> {
        return Promise.resolve()
    }

    bech32ToHex(bech32Address: string): Promise<string> {
        throw new Error('Method not implemented.')
    }

    changeStrongholdPassword(password: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    clearListeners(eventTypes: WalletEventType[]): Promise<void> {
        throw new Error('Method not implemented.')
    }

    clearStrongholdPassword(): Promise<void> {
        return Promise.resolve()
    }

    createAccount(account: CreateAccountPayload): Promise<IAccount> {
        return Promise.resolve(new AccountMock())
    }

    destroy(): Promise<void> {
        return Promise.resolve()
    }

    emitTestEvent(event: WalletEvent): Promise<void> {
        throw new Error('Method not implemented.')
    }

    generateMnemonic(): Promise<string> {
        return Promise.resolve(MOCK_MNEMONIC)
    }

    generateEd25519Address(
        accountIndex: number,
        internal: boolean,
        addressIndex: number,
        options?: GenerateAddressOptions,
        bech32Hrp?: string
    ): Promise<string> {
        throw new Error('Method not implemented.')
    }

    getAccount(accountIndex: AccountId): Promise<IAccount> {
        throw new Error('Method not implemented.')
    }

    getAccountIndexes(): Promise<number[]> {
        throw new Error('Method not implemented.')
    }

    getAccounts(): Promise<IAccount[]> {
        throw new Error('Method not implemented.')
    }

    getNodeInfo(url: string, auth?: IAuth): Promise<INodeInfoResponse> {
        return Promise.resolve({
            nodeInfo: {
                name: 'HORNET',
                version: '2.0.0-alpha10',
                status: {
                    isHealthy: true,
                    latestMilestone: {
                        index: 95112,
                        timestamp: 1652207614,
                        milestoneId: '0x1dcee113052173537d0847a5997c92b53b7204fbffd974bf7f9fc489182aac36',
                    },
                    confirmedMilestone: {
                        index: 95112,
                        timestamp: 1652207614,
                        milestoneId: '0x1dcee113052173537d0847a5997c92b53b7204fbffd974bf7f9fc489182aac36',
                    },
                    pruningIndex: 34629,
                },
                protocol: {
                    version: 2,
                    networkName: 'alphanet-5',
                    bech32Hrp: 'rms',
                    minPowScore: 1000,
                    rentStructure: {
                        vByteCost: 500,
                        vByteFactorKey: 10,
                        vByteFactorData: 1,
                    },
                    tokenSupply: '2779530283277761',
                },
                baseToken: {
                    name: 'Shimmer',
                    tickerSymbol: 'SMR',
                    unit: 'SMR',
                    subunit: 'glow',
                    decimals: 6,
                    useMetricPrefix: false,
                },
                metrics: {
                    blocksPerSecond: 1.3,
                    referencedBlocksPerSecond: 1.3,
                    referencedRate: 100,
                },
                supportedProtocolVersions: [],
                pendingProtocolParameters: [],
                features: [],
            },
            url,
        })
    }

    getLedgerNanoStatus(): Promise<LedgerNanoStatus> {
        return new Promise((resolve) =>
            resolve({
                connected: true,
                locked: false,
                blindSigningEnabled: false,
            })
        )
    }

    hexToBech32(hex: string, bech32Hrp?: string): Promise<string> {
        throw new Error('Method not implemented.')
    }

    isStrongholdPasswordAvailable(): Promise<boolean> {
        return Promise.resolve(true)
    }

    async listen(_eventTypes: WalletEventType[], _callback: WalletApiEventHandler): Promise<void> {
        return
    }

    recoverAccounts(
        accountStartIndex: number,
        accountGapLimit: number,
        addressGapLimit: number,
        syncOptions: SyncOptions
    ): Promise<IAccount[]> {
        return Promise.resolve([])
    }

    removeLatestAccount(): Promise<void> {
        throw new Error('Method not implemented.')
    }

    restoreBackup(
        source: string,
        password: string,
        ignoreIfCoinTypeMismatch?: boolean,
        ignoreIfBech32Mismatch?: string
    ): Promise<void> {
        return Promise.resolve()
    }

    setClientOptions(options: ClientOptions): Promise<void> {
        return Promise.resolve()
    }

    setStrongholdPassword(password: string): Promise<void> {
        return Promise.resolve()
    }

    setStrongholdPasswordClearInterval(intervalInMilliseconds?: number): Promise<void> {
        throw new Error('Method not implemented.')
    }

    startBackgroundSync(options?: SyncOptions, interval?: number): Promise<void> {
        return Promise.resolve()
    }

    stopBackgroundSync(): Promise<void> {
        return Promise.resolve()
    }

    storeMnemonic(mnemonic: string): Promise<void> {
        return Promise.resolve()
    }

    verifyMnemonic(mnemonic: string): Promise<void> {
        return Promise.resolve()
    }

    updateNodeAuth(url: string, auth?: IAuth): Promise<void> {
        return Promise.resolve()
    }
}
