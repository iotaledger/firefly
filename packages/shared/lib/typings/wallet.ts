import { HistoryDataProps } from './market'

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

export interface DateDiff {
    unit: string
    value?: number
}
