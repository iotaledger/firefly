import type { AvailableExchangeRates } from './currency'
import type { ChartSelectors } from './chart'

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
}

/**
 * User Settings
 */
export interface UserSettings {
    currency: AvailableExchangeRates
    automaticNodeSelection: boolean
    includeOfficialNodes: boolean
    disabledNodes: string[] | undefined
    /** Lock screen timeout in minutes */
    lockScreenTimeout: number
    showHiddenAccounts?: boolean
    chartSelectors: ChartSelectors
    hideNetworkStatistics?: boolean
    /** profile colors */
    color: string
    pattern: string
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
 * Profile import types
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
