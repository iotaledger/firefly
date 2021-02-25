import { Unit, convertUnits } from '@iota/unit-converter'
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

export const getAccountActivityData = (account) => {
    const activityMonths = 6
    let date = new Date();
    let activityTimeframes = []
    let incoming = { data: [], tooltips: [], label: 'Incoming' } // TODO: localize
    let outgoing = { data: [], tooltips: [], label: 'Outgoing' } // TODO: localize
    let labels = []
    let messages = account.messages.sort((a, b) => {
        return <any>new Date(a.timestamp).getTime() - <any>new Date(b.timestamp).getTime()
    })
    for (var i = 0; i < activityMonths; i++) {
        let start = new Date(date.getFullYear(), date.getMonth() - i, 1).getTime();
        let end = new Date(date.getFullYear(), date.getMonth() - i + 1, 0).getTime();
        activityTimeframes.push({ start, end })
        labels.unshift(new Date(start).toLocaleString('default', {
            month: 'short',
        }))
    }
    if (account.messages.length) {
        let index = 0
        activityTimeframes.forEach(({ start, end }) => {
            let _incoming = 0
            let _outgoing = 0
            if (new Date(messages[messages.length - 1].timestamp).getTime() >= start && new Date(messages[messages.length - 1].timestamp).getTime() <= end) {
                for (index; index < messages.length; index++) {
                    const message = messages[index]
                    const messageTimestamp = new Date(message.timestamp).getTime()
                    if (messageTimestamp >= start && messageTimestamp <= end) {
                        const valueMiota = convertUnits(message.value, Unit.i, Unit.Mi)
                        if (message.incoming) {
                            _incoming += valueMiota
                        }
                        else {
                            _outgoing += valueMiota
                        }
                    }
                    else if (messageTimestamp > end) return
                }
            }
            incoming.data.unshift(_incoming)
            incoming.tooltips.unshift(`Incoming ${_incoming} Mi`) // TODO: localize
            outgoing.data.unshift(_outgoing)
            outgoing.tooltips.unshift(`Outgoing ${_outgoing} Mi`) // TODO: localize
        })
    }
    else {
        activityTimeframes.forEach(() => {
            incoming.data.push(0)
            incoming.tooltips.push(`Incoming ${0} Mi`) // TODO: localize
            outgoing.data.push(0)
            outgoing.tooltips.push(`Outgoing ${0} Mi`) // TODO: localize
        })
    }
    let chartData = {
        incoming,
        outgoing,
        labels
    }
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
    const title = `${showMiota ? `1 ${Unit.Mi}: ` : ''}${data} ${get(chartCurrency).toUpperCase()}`
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