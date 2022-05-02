import { AvailableExchangeRates } from './currency'
import { ChartSelectors } from './chart'
import { NetworkConfig } from './network'
import { AccountStakingRewards } from '@lib/participation/types'
import { Account, AccountId, CreateAccountPayload, EventType } from '@iota/wallet'

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
    protocol: ProfileProtocol
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
 * Profile protocols
 */
export enum ProfileProtocol {
    Iota = 'IOTA',
    Shimmer = 'Shimmer',
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

export interface ProfileManager {
    getAccount(accountId: AccountId): Promise<Account>
    getAccounts(): Promise<Account[]>
    createAccount(account: CreateAccountPayload): Promise<Account>
    setStrongholdPassword(password: string): Promise<string>
    generateMnemonic(): Promise<string>
    storeMnemonic(mnemonic: string): Promise<string>
    verifyMnemonic(mnemonic: string): Promise<string>
    backup(destination: string, password: string): Promise<string>
    importAccounts(backupPath: string, password: string): Promise<string>
    listen(eventTypes: EventType[], callback: (error: Error, result: string) => void): void
}
