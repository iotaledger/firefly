import { get, writable } from 'svelte/store'
import { CurrencyTypes } from './currency'
import {
    priceData,
    HistoryDataProps,
} from './marketData'

export interface Tooltip {
    title: string
    label: string
}
export interface ChartData {
    data: number[]
    labels: string[]
    tooltips: Tooltip[]
}

export enum DashboardChartType {
    PORTFOLIO = 'Portfolio', // TODO: localize
    TOKEN = 'Token', // TODO: localize
}
export enum AccountChartType {
    Value = 'Value',
    Activity = 'Activity',
}

/** Selected currency on chart */
export const chartCurrency = writable<CurrencyTypes>(CurrencyTypes.USD)

/** Selected time frame on chart */
export const chartTimeframe = writable<HistoryDataProps>(HistoryDataProps.SEVEN_DAYS)

/** Selected chart */
export const selectedChart = writable<DashboardChartType>(DashboardChartType.PORTFOLIO)

export function getPortfolioData(balanceHistory = {}) {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    const fiatHistoryData = get(priceData)[get(chartCurrency)][get(chartTimeframe)].sort((a, b) => a[0] - b[0])
    chartData = balanceHistory[get(chartTimeframe)].reduce(
        (acc, values, index) => {
            const fiatBalance = ((values.balance * fiatHistoryData[index][1]) / 1000000).toFixed(5)
            acc.data.push(fiatBalance)
            acc.labels.push(formatLabel(values.timestamp * 1000))
            acc.tooltips.push(formatLineChartTooltip(fiatBalance, values.timestamp * 1000))
            return acc
        },
        { labels: [], data: [], tooltips: [] }
    )
    if (get(chartTimeframe) === HistoryDataProps.SEVEN_DAYS) {
        // skip labels for seven days timeframe
        let skippedLabels = skipLabels(chartData.labels)
        chartData = { ...chartData, labels: skippedLabels }
    }
    return chartData
}

export function getTokenData(): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    chartData = get(priceData)[get(chartCurrency)][get(chartTimeframe)]
        .sort((a, b) => a[0] - b[0])
        .reduce(
            (acc, values) => {
                acc.data.push(parseFloat(values[1]))
                acc.labels.push(formatLabel(values[0] * 1000))
                acc.tooltips.push(formatLineChartTooltip(parseFloat(values[1]), values[0] * 1000, true))
                return acc
            },
            { labels: [], data: [], tooltips: [] }
        )
    if (get(chartTimeframe) === HistoryDataProps.SEVEN_DAYS) {
        // skip labels for seven days timeframe
        let skippedLabels = skipLabels(chartData.labels)
        chartData = { ...chartData, labels: skippedLabels }
    }
    return chartData
}

export function getAccountValueData(balanceHistory): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    const fiatHistoryData = get(priceData)[get(chartCurrency)][get(chartTimeframe)].sort((a, b) => a[0] - b[0])
    chartData = balanceHistory[get(chartTimeframe)].reduce(
        (acc, values, index) => {
            const fiatBalance = ((values.balance * fiatHistoryData[index][1]) / 1000000).toFixed(5)
            acc.data.push(fiatBalance)
            acc.labels.push(formatLabel(values.timestamp * 1000))
            acc.tooltips.push(formatLineChartTooltip(fiatBalance, values.timestamp * 1000))
            return acc
        },
        { labels: [], data: [], tooltips: [] }
    )
    return chartData
}

function skipLabels(labels) {
    let _displayedLabels = []
    let _blacklistedLabels = []
    let skippedLabels = labels.map((label, index) => {
        if (index === 0 && labels.filter((l) => l === label).length < 4) {
            _blacklistedLabels.push(label)
        }
        if (_displayedLabels.includes(label) || _blacklistedLabels.includes(label)) {
            return ''
        } else {
            _displayedLabels.push(label)
            return label
        }
    })
    return skippedLabels
}

function formatLabel(timestamp: number): string {
    const date = new Date(timestamp)
    var formattedLabel: string = ''
    switch (get(chartTimeframe)) {
        case HistoryDataProps.ONE_HOUR:
        case HistoryDataProps.TWENTY_FOUR_HOURS:
            formattedLabel = date.toLocaleString('default', {
                hour: '2-digit',
                minute: '2-digit',
            })
            break
        case HistoryDataProps.SEVEN_DAYS:
            formattedLabel = date.toLocaleString('default', {
                month: 'short',
                day: 'numeric'
            })
            break
        case HistoryDataProps.ONE_MONTH:
            formattedLabel = date.toLocaleString('default', {
                month: 'short',
                day: 'numeric'
            })
            break
    }
    return formattedLabel
}

function formatLineChartTooltip(data: (number | string), timestamp: number | string, showMiota: boolean = false) {
    const title = `${showMiota ? '1 Miota: ' : ''}${data} ${get(chartCurrency).toUpperCase()}`
    const label = new Date(timestamp).toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })
    return { title, label }
}