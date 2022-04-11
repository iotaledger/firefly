import { AvailableExchangeRates } from './currency'
import { ChartSelectors } from './chart'
import { NetworkConfig } from './network'
import { AccountStakingRewards } from '@lib/participation/types'

export interface MigratedTransaction {
    address: string
    balance: number
    timestamp: string
    account: number
    tailTransactionHash: string
}

/**
 * Profile
 */
export interface Profile {
    id: string
    name: string
    type: ProfileType
    /**
     * Time for most recent stronghold back up
     */
    lastStrongholdBackupTime: Date | null
    /**
     * User settings
     */
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

/**
 * User Settings
 */
export interface UserSettings {
    currency: AvailableExchangeRates
    networkConfig: NetworkConfig
    /** Lock screen timeout in minutes */
    lockScreenTimeout: number
    showHiddenAccounts?: boolean
    chartSelectors: ChartSelectors
    hideNetworkStatistics?: boolean
}

/**
 * Profile types
 */
export enum ProfileType {
    Software = 'Software',
    Ledger = 'Ledger',
    LedgerSimulator = 'LedgerSimulator',
}

/**
 * Profile imports
 */
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
/**
 * Profile account settings
 */
export interface ProfileAccount {
    id: string
    color: string
}
