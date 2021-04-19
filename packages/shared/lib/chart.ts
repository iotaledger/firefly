import { Unit } from '@iota/unit-converter'
import { AvailableExchangeRates, convertToFiat, currencies, exchangeRates } from 'shared/lib/currency'
import { localize } from 'shared/lib/i18n'
import { activeProfile, updateProfile } from 'shared/lib/profile'
import { formatUnitPrecision } from 'shared/lib/units'
import type { WalletAccount } from 'shared/lib/wallet'
import { isSelfTransaction, wallet } from 'shared/lib/wallet'
import { formatDate } from 'shared/lib/i18n'
import { derived, get, writable } from 'svelte/store'
import { CurrencyTypes, formatCurrencyValue } from './currency'
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

export interface ChartSelectors {
    currency: AvailableExchangeRates,
    timeframe: HistoryDataProps
}

export interface Chart {
    time: number
    type: string,
    message: string
}

/** Selected chart */
export const selectedChart = writable<DashboardChartType>(DashboardChartType.PORTFOLIO)

const fiatHistoryData = derived([priceData, activeProfile], ([$priceData, $activeProfile]) => {
    if ($activeProfile?.settings) {
        // back compatibility: init profile chartSelectors
        if (!$activeProfile?.settings.chartSelectors) {
            let chartSelectors = {
                currency: AvailableExchangeRates.USD,
                timeframe: HistoryDataProps.SEVEN_DAYS,
            }
            updateProfile('settings.chartSelectors', chartSelectors)
        }
        //
        return $priceData?.[$activeProfile?.settings.chartSelectors.currency.toLocaleLowerCase()]?.[$activeProfile?.settings.chartSelectors.timeframe]?.slice().sort((a, b) => a[0] - b[0]) ?? []
    }
})

const walletBalance = derived(wallet, $wallet => {
    const { balanceOverview } = $wallet
    return get(balanceOverview)?.balanceRaw
})

export function getPortfolioData(balanceHistory: BalanceHistory): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    const _fiatHistoryData = get(fiatHistoryData)
    chartData = balanceHistory[get(activeProfile)?.settings.chartSelectors.timeframe].reduce(
        (acc, values, index) => {
            const fiatBalance = ((values.balance * _fiatHistoryData[index][1]) / 1000000).toFixed(5)
            acc.data.push(fiatBalance)
            acc.labels.push(formatLabel(values.timestamp * 1000))
            acc.tooltips.push(formatLineChartTooltip(fiatBalance, values.timestamp * 1000))
            return acc
        },
        { labels: [], data: [], tooltips: [] }
    )
    // add current balance
    const currentBalanceData = getCurrentBalancedata(get(walletBalance))
    chartData.data.push(currentBalanceData.data)
    chartData.labels.push(currentBalanceData.label)
    chartData.tooltips.push(currentBalanceData.tooltip)
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

export function getAccountValueData(balanceHistory: BalanceHistory, accountBalance: number): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    const _fiatHistoryData = get(fiatHistoryData)
    chartData = balanceHistory[get(activeProfile)?.settings.chartSelectors.timeframe].reduce(
        (acc, values, index) => {
            const fiatBalance = ((values.balance * _fiatHistoryData[index][1]) / 1000000).toFixed(5)
            acc.data.push(fiatBalance)
            acc.labels.push(formatLabel(values.timestamp * 1000))
            acc.tooltips.push(formatLineChartTooltip(fiatBalance, values.timestamp * 1000))
            return acc
        },
        { labels: [], data: [], tooltips: [] }
    )
    // add current balance
    const currentBalanceData = getCurrentBalancedata(accountBalance)
    chartData.data.push(currentBalanceData.data)
    chartData.labels.push(currentBalanceData.label)
    chartData.tooltips.push(currentBalanceData.tooltip)
    return chartData
}

export const getAccountActivityData = (account: WalletAccount) => {
    let now = new Date();
    let activityTimeframes: ActivityTimeframe[] = []
    let incoming: ChartData = { data: [], tooltips: [], label: localize('general.incoming'), color: account.color || 'blue' } // TODO: profile colors
    let outgoing: ChartData = { data: [], tooltips: [], label: localize('general.outgoing'), color: 'gray' } // TODO: profile colors
    let labels: string[] = []
    let messages: Message[] = account.messages.slice()
        ?.filter(({ payload }) => !isSelfTransaction(payload, account)) // Remove self transactions
        ?.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) ?? []
    for (var i = 0; i < BAR_CHART_ACTIVITY_MONTHS; i++) {
        let start: number = new Date(now.getFullYear(), now.getMonth() - i, 1).getTime();
        let end: number = new Date(now.getFullYear(), now.getMonth() - i + 1, 0).getTime();
        activityTimeframes.push({ start, end })
        labels.unshift(
            formatDate(new Date(start), { month: 'short' }))
    }
    if (messages?.length) {
        let index = 0
        activityTimeframes.forEach(({ start, end }) => {
            let _incoming = 0
            let _outgoing = 0
            if (new Date(messages[messages.length - 1].timestamp).getTime() >= start && new Date(messages[messages.length - 1].timestamp).getTime() <= end) {
                for (index; index < messages.length; index++) {
                    const message = messages[index]

                    if (message.payload.type === 'Transaction') {
                        const messageTimestamp = new Date(message.timestamp).getTime()
                        if (messageTimestamp >= start && messageTimestamp <= end) {
                            if (message.payload.data.essence.data.incoming) {
                                _incoming += message.payload.data.essence.data.value
                            }
                            else {
                                _outgoing += message.payload.data.essence.data.value
                            }
                        }
                        else if (messageTimestamp > end) return
                    }
                }
            }

            incoming.data.unshift(_incoming)
            incoming.tooltips.unshift({
                title: formatDate(new Date(start), {
                    year: 'numeric',
                    month: 'long'
                }),
                label: localize('charts.incomingMi', {
                    values: {
                        value: formatUnitPrecision(_incoming, Unit.Mi, true)
                    }
                })
            })
            outgoing.data.unshift(_outgoing)
            outgoing.tooltips.unshift({
                title: formatDate(new Date(start), {
                    year: 'numeric',
                    month: 'long'
                }), label: localize('charts.outgoingMi', {
                    values: {
                        value: formatUnitPrecision(_outgoing, Unit.Mi, true)
                    }
                })
            })
        })
    }
    else {
        activityTimeframes.forEach(({ start, end }) => {
            incoming.data.push(0)
            incoming.tooltips.unshift({
                title: formatDate(new Date(start), {
                    year: 'numeric',
                    month: 'long'
                }), label: localize('charts.incomingMi', {
                    values: {
                        value: 0
                    }
                })
            })
            outgoing.data.unshift(0)
            outgoing.tooltips.unshift({
                title: formatDate(new Date(start), {
                    year: 'numeric',
                    month: 'long'
                }), label: localize('charts.outgoingMi', {
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
    switch (get(activeProfile)?.settings.chartSelectors.timeframe) {
        case HistoryDataProps.ONE_HOUR:
        case HistoryDataProps.TWENTY_FOUR_HOURS:
            formattedLabel = formatDate(new Date(date), {
                hour: '2-digit',
                minute: '2-digit',
            })
            break
        case HistoryDataProps.SEVEN_DAYS:
        case HistoryDataProps.ONE_MONTH:
            formattedLabel = formatDate(new Date(date), {
                month: 'short',
                day: 'numeric'
            })
            break
    }
    return formattedLabel
}

function formatLineChartTooltip(data: (number | string), timestamp: number | string, showMiota: boolean = false): Tooltip {
    const currency = get(activeProfile)?.settings.chartSelectors.currency ?? ''
    const title: string = `${showMiota ? `1 ${Unit.Mi}: ` : ''}${formatCurrencyValue(data, currency, 3)} ${currency}`
    const label: string = formatDate(new Date(timestamp), {
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

function getCurrentBalancedata(balance): { data: number, label: string, tooltip: Tooltip } {
    const now = new Date().getTime()
    const fiatBalance = convertToFiat(balance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[get(activeProfile)?.settings.chartSelectors.currency])
    return { data: fiatBalance, label: formatLabel(now), tooltip: formatLineChartTooltip(fiatBalance, now) }
}
