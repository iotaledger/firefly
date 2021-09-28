import type { HistoryDataProps } from './market'
import type { AvailableExchangeRates } from './currency'

export interface Tooltip {
    title: string
    label: string
}

export interface ChartData {
    data: number[]
    label?: string
    labels?: string[]
    tooltips?: Tooltip[]
    color?: string
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
