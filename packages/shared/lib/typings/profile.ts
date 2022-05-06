import { AvailableExchangeRates } from './currency'
import { ChartSelectors } from './chart'
import { NetworkConfig } from './network'
import { AccountStakingRewards } from '@lib/participation/types'
import { AccountId, CreateAccountPayload, EventType, NodeInfo } from '@iota/wallet'
import { StardustAccount } from '@lib/typings/account'

export interface MigratedTransaction {
    address: string
    balance: number
    timestamp: string
    account: number
    tailTransactionHash: string
}

export interface Profile {
    id: string
    name: string
    type: ProfileType
    protocol: ProfileProtocol
    lastStrongholdBackupTime: Date | null
    settings: UserSettings
    hiddenAccounts?: string[]
    migratedTransactions?: MigratedTransaction[]
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    ledgerMigrationCount?: number
    hasVisitedStaking?: boolean
    lastShimmerPeriodVisitedStaking?: number
    lastAssemblyPeriodVisitedStaking?: number
    lastUsedAccountId?: string
    accounts?: ProfileAccount[]
    stakingRewards?: AccountStakingRewards[]
    hasFinishedSingleAccountGuide?: boolean
}

export interface UserSettings {
    currency: AvailableExchangeRates
    networkConfig: NetworkConfig
    /** Lock screen timeout in minutes */
    lockScreenTimeout: number
    showHiddenAccounts?: boolean
    chartSelectors: ChartSelectors
    hideNetworkStatistics?: boolean
}

export enum ProfileType {
    Software = 'Software',
    Ledger = 'Ledger',
    LedgerSimulator = 'LedgerSimulator',
}

export enum ProfileProtocol {
    Iota = 'iota',
    Shimmer = 'shimmer',
}

export enum ImportType {
    Seed = 'seed',
    Mnemonic = 'mnemonic',
    File = 'file',
    SeedVault = 'seedvault',
    Stronghold = 'stronghold',
    Ledger = 'ledger',
    TrinityLedger = 'trinityLedger',
    FireflyLedger = 'fireflyLedger',
}

export interface ProfileAccount {
    id: string
    color: string
}
