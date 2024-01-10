import { ChrysalisNetworkId, ProfileType } from '../enums'
import { ChrysalisAccountStakingRewards } from '../types'

export interface IChrysalisPersistedProfile {
    id: string
    name: string
    type: ProfileType

    lastStrongholdBackupTime: Date
    strongholdVersion: number

    settings: IChrysalisProfileSettings
    hiddenAccounts?: string[]
    migratedTransactions?: IChrysalisMigratedTransaction[]
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    ledgerMigrationCount?: number
    hasVisitedStaking?: boolean
    lastShimmerPeriodVisitedStaking?: number
    lastAssemblyPeriodVisitedStaking?: number
    lastUsedAccountId?: string // TODO(2.0) Accounts are gone
    accounts?: IChrysalisProfileAccount[]
    stakingRewards?: ChrysalisAccountStakingRewards[]
    hasFinishedSingleAccountGuide?: boolean
}

export interface IChrysalisProfileAccount {
    id: string
    color: string
}

export interface IChrysalisStakingPeriodRewards {
    [address: string]: number
}

export interface IChrysalisMigratedTransaction {
    address: string
    balance: number
    timestamp: string
    account: number
    tailTransactionHash: string
}

export interface IChrysalisProfileSettings {
    currency: string
    networkConfig: IChrysalisNetworkConfiguration
    lockScreenTimeout: number
    showHiddenAccounts?: boolean
    hideNetworkStatistics?: boolean
}

export interface IChrysalisNetworkConfiguration {
    nodes?: IChrysalisNode[]
    network?: IChrysalisNetwork
    automaticNodeSelection?: boolean
    includeOfficialNodes?: boolean
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}

export interface IChrysalisNode {
    url: string
    auth?: IChrysalisNodeAuth
    network?: IChrysalisNetwork
    isPrimary?: boolean
    isDisabled?: boolean
}

export interface IChrysalisNodeAuth {
    jwt?: string
    username?: string
    password?: string
}

export interface IChrysalisNetwork {
    id: ChrysalisNetworkId
    name: string
    type: ChrysalisNetworkId
    bech32Hrp: string
}
