import { HistoryDataProps } from './market'
import { AvailableExchangeRates } from './currency'
import { AccountColor } from './color'

export interface Tooltip {
    title: string
    label: string
}

export interface ChartData {
    data: number[]
    label?: string
    labels?: string[]
    tooltips?: Tooltip[]
    color?: string | AccountColor
    steppedLine?: boolean
}

export interface ActivityData {
    incoming: ChartData
    outgoing: ChartData
    labels?: string[]
}

export interface ActivityTimeframe {
    start: number
    end: number
}

export enum DashboardChartType {
    HOLDINGS = 'holdings',
    PORTFOLIO = 'portoflio',
    TOKEN = 'token',
}

export enum WalletChartType {
    HOLDINGS = 'holdings',
    PORTFOLIO = 'portoflio',
    TOKEN = 'token',
}

export enum AccountChartType {
    Value = 'Value',
    Activity = 'Activity',
}

export interface ChartSelectors {
    currency: AvailableExchangeRates
    timeframe: HistoryDataProps
}

export interface Chart {
    time: number
    type: string
    message: string
}
