import type { AccountId, CreateAccountPayload, NodeInfo } from '@iota/wallet'
import { StardustAccount } from '../../typings/account'
import { AccountMock } from './account.mock'
import { IProfileManager } from '../../core/profile-manager'
import { IAuth, INodeInfoResponse } from '../../core/network'

export const MOCK_MNEMONIC =
    'term aisle loyal cradle talent buddy crater express asthma load antique game better head position master aspect print more wine sword speed joy story'

export class ProfileManagerMock implements IProfileManager {
    getAccount(accountId: AccountId) {
        return undefined
    }

    getAccounts() {
        return undefined
    }

    getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> {
        return Promise.resolve({
            nodeinfo: {
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
                    bech32HRP: 'rms',
                    minPoWScore: 1000,
                    rentStructure: {
                        vByteCost: 500,
                        vByteFactorKey: 10,
                        vByteFactorData: 1,
                    },
                    tokenSupply: 2779530283277761,
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
                    messagesPerSecond: 1.3,
                    referencedMessagesPerSecond: 1.3,
                    referencedRate: 100,
                },
                features: [],
                plugins: ['debug/v1', 'participation/v1', 'indexer/v1', 'mqtt/v1'],
            },
            url,
        })
    }

    createAccount(account: CreateAccountPayload): Promise<StardustAccount> {
        return Promise.resolve(new AccountMock())
    }

    setStrongholdPassword(password: string): Promise<string> {
        return Promise.resolve(password)
    }

    generateMnemonic(): Promise<string> {
        return Promise.resolve(MOCK_MNEMONIC)
    }

    storeMnemonic(mnemonic: string): Promise<string> {
        return Promise.resolve(mnemonic)
    }

    verifyMnemonic(mnemonic: string): Promise<string> {
        return Promise.resolve(mnemonic)
    }

    backup(_: string, __: string): Promise<void> {
        return Promise.resolve()
    }

    importAccounts(backupPath: string, _: string): Promise<string> {
        return Promise.resolve(backupPath)
    }

    listen(eventTypes, callback) {
        return
    }
}
