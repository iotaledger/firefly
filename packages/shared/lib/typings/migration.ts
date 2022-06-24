import { Writable } from 'svelte/store'

export interface MigrationAddress {
    bech32: string
    trytes: string
}

export interface AddressInput {
    address: string
    index: number
}

export interface Input {
    address: string
    balance: number
    spent: boolean
    index: number
    securityLevel: number
    spentBundleHashes: string[]
}

export interface MigrationData {
    lastCheckedAddressIndex: number
    balance: number
    inputs: Input[]
    spentAddresses?: boolean
}

export interface MigrationBundle {
    bundleHash: string
    crackability?: number
    trytes?: string[]
}

export interface SendMigrationBundleResponse {
    address: string
    value: number
    tailTransactionHash: string
}

export interface Transfer {
    address: string
    value: number
    tag: string
}

export enum RiskLevel {
    VERYHIGH = 10 ** -13,
    HIGH = 10 ** -15,
    MEDIUM = 10 ** -17,
    LOW = 10 ** -19,
    VERYLOW = 0,
}

export interface MigrationLog {
    bundleHash: string
    trytes: string[]
    receiveAddressTrytes: string
    balance: number
    timestamp: string
    spentAddresses: string[]
    spentBundleHashes: string[]
    mine: boolean
    crackability: number | null
}

export interface Bundle {
    index: number
    shouldMine: boolean
    selectedToMine: boolean
    bundleHash?: string
    crackability?: number
    migrated: boolean
    selected: boolean
    inputs: Input[]
    miningRuns: number
    confirmed: boolean
    trytes?: string[]
}

export interface HardwareIndexes {
    accountIndex: number
    pageIndex: number
}

export interface MigrationState {
    didComplete: Writable<boolean>
    data: Writable<MigrationData>
    seed: Writable<string>
    bundles: Writable<Bundle[]>
}

export enum LedgerMigrationProgress {
    InstallLedgerApp,
    GenerateAddress,
    SwitchLedgerApp,
    TransferFunds,
}
