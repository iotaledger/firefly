import { convertUnits, Unit } from '@iota/unit-converter'
import { _ } from 'shared/lib/i18n'
import type { WalletAccount } from 'shared/lib/wallet'
import { date as i18nDate } from 'svelte-i18n'
import { derived, get, writable } from 'svelte/store'
import { CurrencyTypes } from './currency'
import {
    HistoryDataProps,
    priceData
} from './marketData'
import type { Message } from './typings/message'
import type { BalanceHistory } from './wallet'

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

interface ActivityTimeframe {
    start: number,
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

const BAR_CHART_ACTIVITY_MONTHS = 6

/** Selected currency on chart */
export const chartCurrency = writable<CurrencyTypes>(CurrencyTypes.USD)

/** Selected time frame on chart */
export const chartTimeframe = writable<HistoryDataProps>(HistoryDataProps.SEVEN_DAYS)

/** Selected chart */
export const selectedChart = writable<DashboardChartType>(DashboardChartType.PORTFOLIO)

const fiatHistoryData = derived([priceData, chartCurrency, chartTimeframe], ([$priceData, $chartCurrency, $chartTimeframe]) => {
    return $priceData?.[$chartCurrency]?.[$chartTimeframe]?.slice().sort((a, b) => a[0] - b[0]) ?? []
})

export function getPortfolioData(balanceHistory: BalanceHistory): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    const _fiatHistoryData = get(fiatHistoryData)
    chartData = balanceHistory[get(chartTimeframe)].reduce(
        (acc, values, index) => {
            const fiatBalance = ((values.balance * _fiatHistoryData[index][1]) / 1000000).toFixed(5)
            acc.data.push(fiatBalance)
            acc.labels.push(formatLabel(values.timestamp * 1000))
            acc.tooltips.push(formatLineChartTooltip(fiatBalance, values.timestamp * 1000))
            return acc
        },
        { labels: [], data: [], tooltips: [] }
    )
    return chartData
}

export function getTokenData(): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    chartData = get(fiatHistoryData)
        .reduce(
            (acc, values) => {
                acc.data.push(parseFloat(values[1]))
                acc.labels.push(formatLabel(values[0] * 1000))
                acc.tooltips.push(formatLineChartTooltip(parseFloat(values[1]), values[0] * 1000, true))
                return acc
            },
            { labels: [], data: [], tooltips: [] }
        )
    return chartData
}

export function getAccountValueData(balanceHistory: BalanceHistory): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    const _fiatHistoryData = get(fiatHistoryData)
    chartData = balanceHistory[get(chartTimeframe)].reduce(
        (acc, values, index) => {
            const fiatBalance = ((values.balance * _fiatHistoryData[index][1]) / 1000000).toFixed(5)
            acc.data.push(fiatBalance)
            acc.labels.push(formatLabel(values.timestamp * 1000))
            acc.tooltips.push(formatLineChartTooltip(fiatBalance, values.timestamp * 1000))
            return acc
        },
        { labels: [], data: [], tooltips: [] }
    )
    return chartData
}

export const getAccountActivityData = (account: WalletAccount) => {
    const locale = get(_) as (string, values?) => string
    let now = new Date();
    let activityTimeframes: ActivityTimeframe[] = []
    let incoming: ChartData = { data: [], tooltips: [], label: locale('general.incoming'), color: account.color || 'blue' } // TODO: profile colors
    let outgoing: ChartData = { data: [], tooltips: [], label: locale('general.outgoing'), color: 'gray' } // TODO: profile colors
    let labels: string[] = []
    let messages: Message[] = account.messages.slice().sort((a, b) => {
        return <any>new Date(a.timestamp).getTime() - <any>new Date(b.timestamp).getTime()
    })
    for (var i = 0; i < BAR_CHART_ACTIVITY_MONTHS; i++) {
        let start: number = new Date(now.getFullYear(), now.getMonth() - i, 1).getTime();
        let end: number = new Date(now.getFullYear(), now.getMonth() - i + 1, 0).getTime();
        activityTimeframes.push({ start, end })
        labels.unshift(
            get(i18nDate)(new Date(start), { month: 'short' }))
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
                        const valueMiota = convertUnits(message.payload.data.essence.data.value, Unit.i, Unit.Mi)
                        if (message.payload.data.essence.data.incoming) {
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
            incoming.tooltips.unshift({
                title: get(i18nDate)(new Date(start), {
                    year: 'numeric',
                    month: 'long'
                }),
                label: locale('charts.incoming_mi', {
                    values: {
                        value: _incoming
                    }
                })
            })
            outgoing.data.unshift(_outgoing)
            outgoing.tooltips.unshift({
                title: get(i18nDate)(new Date(start), {
                    year: 'numeric',
                    month: 'long'
                }), label: locale('charts.outgoing_mi', {
                    values: {
                        value: _outgoing
                    }
                })
            })
        })
    }
    else {
        activityTimeframes.forEach(({ start, end }) => {
            incoming.data.push(0)
            incoming.tooltips.unshift({
                title: get(i18nDate)(new Date(start), {
                    year: 'numeric',
                    month: 'long'
                }), label: locale('charts.incoming_mi', {
                    values: {
                        value: 0
                    }
                })
            })
            outgoing.data.unshift(0)
            outgoing.tooltips.unshift({
                title: get(i18nDate)(new Date(start), {
                    year: 'numeric',
                    month: 'long'
                }), label: locale('charts.outgoing_mi', {
                    values: {
                        value: 0
                    }
                })
            })
        })
    }
    let chartData = {
        incoming,
        outgoing,
        labels
    }
    return chartData
}

function formatLabel(timestamp: number): string {
    const date: Date = new Date(timestamp)
    var formattedLabel: string = ''
    switch (get(chartTimeframe)) {
        case HistoryDataProps.ONE_HOUR:
        case HistoryDataProps.TWENTY_FOUR_HOURS:
            formattedLabel = get(i18nDate)(new Date(date), {
                hour: '2-digit',
                minute: '2-digit',
            })
            break
        case HistoryDataProps.SEVEN_DAYS:
        case HistoryDataProps.ONE_MONTH:
            formattedLabel = get(i18nDate)(new Date(date), {
                month: 'short',
                day: 'numeric'
            })
            break
    }
    return formattedLabel
}

function formatLineChartTooltip(data: (number | string), timestamp: number | string, showMiota: boolean = false): Tooltip {
    const title: string = `${showMiota ? `1 ${Unit.Mi}: ` : ''}${data} ${get(chartCurrency).toUpperCase()}`
    const label: string = get(i18nDate)(new Date(timestamp), {
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