import type { AccountId, CreateAccountPayload, AccountSyncOptions, ClientOptions } from '@iota/wallet'
import { IAccount } from '../../core/account'
import { AccountMock } from './account.mock'
import { IProfileManager } from '../../core/profile-manager'
import { IAuth } from '../../core/network'
import { INodeInfoResponse } from '../../core/network/interfaces/node-info-response.interface'

export const MOCK_MNEMONIC =
    'term aisle loyal cradle talent buddy crater express asthma load antique game better head position master aspect print more wine sword speed joy story'

export class ProfileManagerMock implements IProfileManager {
    backup(_: string, __: string): Promise<void> {
        return Promise.resolve()
    }

    clearStrongholdPassword(): Promise<void> {
        return Promise.resolve()
    }

    createAccount(account: CreateAccountPayload): Promise<IAccount> {
        return Promise.resolve(new AccountMock())
    }

    deleteStorage(): Promise<void> {
        return Promise.resolve()
    }

    destroy(): Promise<void> {
        return Promise.resolve()
    }

    generateMnemonic(): Promise<string> {
        return Promise.resolve(MOCK_MNEMONIC)
    }

    getAccount(accountId: AccountId) {
        return undefined
    }

    getAccounts() {
        return undefined
    }

    getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> {
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
                    protocolVersion: 2,
                    networkName: 'alphanet-5',
                    bech32HRP: 'rms',
                    minPoWScore: 1000,
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
                features: [],
                plugins: ['debug/v1', 'participation/v1', 'indexer/v1', 'mqtt/v1'],
            },
            url,
        })
    }

    isStrongholdPasswordAvailable(): Promise<boolean> {
        return Promise.resolve(true)
    }

    listen(eventTypes, callback) {
        return
    }

    recoverAccounts(accountGapLimit: number, addressGapLimit: number): Promise<IAccount[]> {
        return Promise.resolve([])
    }

    restoreBackup(source: string, password: string): Promise<void> {
        return Promise.resolve()
    }

    setClientOptions(options: ClientOptions): Promise<void> {
        return Promise.resolve()
    }

    setStrongholdPassword(password: string): Promise<void> {
        return Promise.resolve()
    }

    startBackgroundSync(options?: AccountSyncOptions, interval?: number): Promise<void> {
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
}
