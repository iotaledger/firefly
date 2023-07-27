import { Unit } from '@iota/unit-converter'
import { convertToFiat, currencies, exchangeRates } from 'shared/lib/currency'
import { localize } from '@core/i18n'
import { activeProfile, updateProfile } from 'shared/lib/profile'
import { formatUnitPrecision } from 'shared/lib/units'
import { isSelfTransaction } from 'shared/lib/wallet'
import { formatDate } from '@core/i18n'
import { derived, get, writable } from 'svelte/store'
import { formatCurrencyValue } from './currency'
import { priceData } from './market'
import { Message } from './typings/message'
import { ActivityTimeframe, ChartData, DashboardChartType, Tooltip, WalletChartType } from './typings/chart'
import { AvailableExchangeRates, CurrencyTypes } from './typings/currency'
import { HistoryDataProps } from './typings/market'
import { BalanceHistory, WalletAccount } from './typings/wallet'
import { AccountColor } from './typings/color'

const BAR_CHART_ACTIVITY_MONTHS = 6

/** Selected chart */
export const selectedDashboardChart = writable<DashboardChartType>(DashboardChartType.HOLDINGS)
export const selectedWalletChart = writable<WalletChartType>(WalletChartType.HOLDINGS)

const fiatHistoryData = derived([priceData, activeProfile], ([$priceData, $activeProfile]) => {
    if ($activeProfile?.settings) {
        // back compatibility: init profile chartSelectors
        if (!$activeProfile?.settings.chartSelectors) {
            const chartSelectors = {
                currency: AvailableExchangeRates.USD,
                timeframe: HistoryDataProps.SEVEN_DAYS,
            }
            updateProfile('settings.chartSelectors', chartSelectors)
        }
        //
        return (
            $priceData?.[$activeProfile?.settings.chartSelectors.currency.toLocaleLowerCase()]?.[
                $activeProfile?.settings.chartSelectors.timeframe
            ]
                ?.slice()
                .sort((a, b) => a[0] - b[0]) ?? []
        )
    }
})

export function getChartDataFromBalanceHistory({
    balanceHistory,
    currentBalance,
    tokenType,
    convertToSelectedCurrency = false,
}: {
    balanceHistory: BalanceHistory
    currentBalance: number
    tokenType: string
    convertToSelectedCurrency?: boolean
}): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    let _fiatHistoryData
    const selectedCurrency = get(activeProfile)?.settings.chartSelectors.currency ?? ''

    if (convertToSelectedCurrency) {
        _fiatHistoryData = get(fiatHistoryData)
    }

    chartData = balanceHistory[get(activeProfile)?.settings.chartSelectors.timeframe].reduce(
        (acc, values, index) => {
            const balance = convertToSelectedCurrency
                ? ((values.balance * _fiatHistoryData[index][1]) / 1000000).toFixed(5)
                : values.balance
            acc.data.push(balance)
            acc.labels.push(formatLabel(values.timestamp * 1000))
            acc.tooltips.push(
                formatLineChartTooltip(
                    balance,
                    convertToSelectedCurrency ? selectedCurrency : tokenType.toLocaleLowerCase(),
                    values.timestamp * 1000,
                    false,
                    convertToSelectedCurrency
                )
            )
            return acc
        },
        { labels: [], data: [], tooltips: [] }
    )
    // add current balance
    const currentBalanceDataPoint = getCurrentBalanceDataPoint({ currentBalance, tokenType, convertToSelectedCurrency })
    chartData.data.push(currentBalanceDataPoint.data)
    chartData.labels.push(currentBalanceDataPoint.label)
    chartData.tooltips.push(currentBalanceDataPoint.tooltip)
    chartData.steppedLine = !convertToSelectedCurrency
    return chartData
}

export function getChartDataForTokenValue(): ChartData {
    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    const currency = get(activeProfile)?.settings.chartSelectors.currency ?? ''
    chartData = get(fiatHistoryData).reduce(
        (acc, values) => {
            acc.data.push(parseFloat(values[1]))
            acc.labels.push(formatLabel(values[0] * 1000))
            acc.tooltips.push(formatLineChartTooltip(parseFloat(values[1]), currency, values[0] * 1000, true))
            return acc
        },
        { labels: [], data: [], tooltips: [] }
    )
    return chartData
}

export const getAccountActivityData = (
    account: WalletAccount
): { incoming: ChartData; outgoing: ChartData; labels: string[] } => {
    const now = new Date()
    const activityTimeframes: ActivityTimeframe[] = []
    const incoming: ChartData = {
        data: [],
        tooltips: [],
        label: localize('general.incoming'),
        color: account.color || AccountColor.Blue,
    } // TODO: profile colors
    const outgoing: ChartData = {
        data: [],
        tooltips: [],
        label: localize('general.outgoing'),
        color: 'gray',
    } // TODO: profile colors
    const labels: string[] = []
    const messages: Message[] =
        account.messages
            .slice()
            ?.filter((message) => message.payload && !isSelfTransaction(message.payload, account)) // Remove self transactions and messages with no payload
            ?.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) ?? []
    for (let i = 0; i < BAR_CHART_ACTIVITY_MONTHS; i++) {
        const start: number = new Date(now.getFullYear(), now.getMonth() - i, 1).getTime()
        const end: number = new Date(now.getFullYear(), now.getMonth() - i + 1, 0).getTime()
        activityTimeframes.push({ start, end })
        labels.unshift(formatDate(new Date(start), { month: 'short' }))
    }
    if (messages?.length) {
        let index = 0
        activityTimeframes.forEach(({ start, end }) => {
            let _incoming = 0
            let _outgoing = 0
            if (
                new Date(messages[messages.length - 1].timestamp).getTime() >= start &&
                new Date(messages[messages.length - 1].timestamp).getTime() <= end
            ) {
                for (index; index < messages.length; index++) {
                    const message = messages[index]

                    if (message.payload.type === 'Transaction') {
                        const messageTimestamp = new Date(message.timestamp).getTime()
                        if (messageTimestamp >= start && messageTimestamp <= end) {
                            if (message.payload.data.essence.data.incoming) {
                                _incoming += message.payload.data.essence.data.value
                            } else {
                                _outgoing += message.payload.data.essence.data.value
                            }
                        } else if (messageTimestamp > end) return
                    }
                }
            }

            incoming.data.unshift(_incoming)
            incoming.tooltips.unshift({
                title: formatDate(new Date(start), {
                    year: 'numeric',
                    month: 'long',
                }),
                label: localize('charts.incomingMi', {
                    values: {
                        value: formatUnitPrecision(_incoming, Unit.Mi, true),
                    },
                }),
            })
            outgoing.data.unshift(_outgoing)
            outgoing.tooltips.unshift({
                title: formatDate(new Date(start), {
                    year: 'numeric',
                    month: 'long',
                }),
                label: localize('charts.outgoingMi', {
                    values: {
                        value: formatUnitPrecision(_outgoing, Unit.Mi, true),
                    },
                }),
            })
        })
    } else {
        activityTimeframes.forEach(({ start, end }) => {
            incoming.data.push(0)
            incoming.tooltips.unshift({
                title: formatDate(new Date(start), {
                    year: 'numeric',
                    month: 'long',
                }),
                label: localize('charts.incomingMi', {
                    values: {
                        value: 0,
                    },
                }),
            })
            outgoing.data.unshift(0)
            outgoing.tooltips.unshift({
                title: formatDate(new Date(start), {
                    year: 'numeric',
                    month: 'long',
                }),
                label: localize('charts.outgoingMi', {
                    values: {
                        value: 0,
                    },
                }),
            })
        })
    }

    return {
        incoming,
        outgoing,
        labels,
    }
}

function formatLabel(timestamp: number): string {
    const date: Date = new Date(timestamp)
    let formattedLabel: string = ''
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
                day: 'numeric',
            })
            break
    }
    return formattedLabel
}

function formatLineChartTooltip(
    data: number | string,
    currency: string,
    timestamp: number | string,
    showMiota: boolean = false,
    showCurrencyUnit: boolean = true
): Tooltip {
    const title: string = `${showMiota ? `1 ${Unit.Mi}: ` : ''}${formatCurrencyValue(data, currency, 3)} ${
        showCurrencyUnit ? currency : ''
    }`
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

function getCurrentBalanceDataPoint({
    currentBalance,
    tokenType,
    convertToSelectedCurrency,
}: {
    currentBalance: number
    tokenType: string
    convertToSelectedCurrency?: boolean
}): { data: number; label: string; tooltip: Tooltip } {
    const selectedCurrency = get(activeProfile)?.settings.chartSelectors.currency ?? ''
    const now = new Date().getTime()
    const balance = convertToSelectedCurrency
        ? convertToFiat(
              currentBalance,
              get(currencies)?.[CurrencyTypes.USD],
              get(exchangeRates)?.[get(activeProfile)?.settings.chartSelectors.currency]
          )
        : currentBalance
    return {
        data: balance,
        label: formatLabel(now),
        tooltip: formatLineChartTooltip(
            balance,
            convertToSelectedCurrency ? selectedCurrency : tokenType.toLocaleLowerCase(),
            now,
            false,
            convertToSelectedCurrency
        ),
    }
}
