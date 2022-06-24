import { Message } from './message'
import { HistoryDataProps } from './market'

export interface AccountMessage extends Message {
    account: number
}

type BalanceTimestamp = {
    timestamp: number
    balance: number
}

export type BalanceHistory = {
    [HistoryDataProps.ONE_HOUR]: BalanceTimestamp[]
    [HistoryDataProps.SEVEN_DAYS]: BalanceTimestamp[]
    [HistoryDataProps.TWENTY_FOUR_HOURS]: BalanceTimestamp[]
    [HistoryDataProps.ONE_MONTH]: BalanceTimestamp[]
}

export interface StrongholdStatus {
    snapshot: {
        status: 'Locked' | 'Unlocked'
    }
    snapshotPath: string
}

export interface DateDiff {
    unit: string
    value?: number
}

export interface LoggerOutput {
    name?: string
    level_filter: 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
    target_filters?: string[]
}

export interface LoggerConfig {
    color_enabled?: boolean
    outputs?: LoggerOutput[]
}

export interface StrongholdPasswordChange {
    currentPassword: string
    newPassword: string
}

export interface Duration {
    secs: number
    nanos: number
}
