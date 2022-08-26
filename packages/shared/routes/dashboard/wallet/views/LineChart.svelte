<script lang="typescript">
    import { Chart, Dropdown } from 'shared/components'
    import {
        getChartDataForTokenValue,
        getChartDataFromBalanceHistory,
        selectedDashboardChart,
        selectedWalletChart,
    } from 'shared/lib/chart'
    import { formatCurrencyValue } from 'shared/lib/currency'
    import { localize } from '@core/i18n'
    import { priceData, TIMEFRAME_MAP } from 'shared/lib/market'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { ChartData, DashboardChartType, WalletChartType } from 'shared/lib/typings/chart'
    import { BalanceHistory } from 'shared/lib/typings/wallet'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import { HistoryDataProps } from 'shared/lib/typings/market'
    import { getAccountBalanceHistory, selectedAccountStore } from 'shared/lib/wallet'
    import { onMount } from 'svelte'

    let balanceHistory: BalanceHistory
    $: $selectedAccountStore, $priceData, (balanceHistory = getAccountBalanceHistory($selectedAccountStore, $priceData))

    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    const chartTypeDropdownItems: { value: string; label: string }[] = []
    const currencyDropdownItems: { value: string; label: string }[] = []
    const tokenDropdownItems = [
        { value: CurrencyTypes.IOTA.toLocaleLowerCase(), label: CurrencyTypes.IOTA.toLocaleUpperCase() },
    ]

    let xMaxTicks

    let datasets: ChartData[]
    let labels: string[]

    $: datasets = [{ data: chartData.data, tooltips: chartData.tooltips, steppedLine: chartData.steppedLine ?? false }]
    $: labels = chartData.labels

    const hasTitleBar = document.body.classList.contains('platform-win32')

    /** Chart data */
    $: {
        if (localize || $selectedDashboardChart || $activeProfile?.settings.chartSelectors || $selectedAccountStore) {
            if ($activeProfile?.settings) {
                // Account value chart
                switch ($selectedWalletChart) {
                    case WalletChartType.HOLDINGS:
                        chartData = getChartDataFromBalanceHistory({
                            balanceHistory,
                            currentBalance: $selectedAccountStore.rawIotaBalance,
                            tokenType: CurrencyTypes.IOTA.toLocaleLowerCase(),
                            convertToSelectedCurrency: false,
                        })
                        break
                    case WalletChartType.PORTFOLIO:
                        chartData = getChartDataFromBalanceHistory({
                            balanceHistory,
                            currentBalance: $selectedAccountStore.rawIotaBalance,
                            tokenType: CurrencyTypes.IOTA.toLocaleLowerCase(),
                            convertToSelectedCurrency: true,
                        })
                        break
                    case WalletChartType.TOKEN:
                        chartData = getChartDataForTokenValue()
                        break
                    default:
                        break
                }
                switch ($activeProfile?.settings.chartSelectors.timeframe) {
                    case HistoryDataProps.ONE_HOUR:
                    case HistoryDataProps.TWENTY_FOUR_HOURS:
                        xMaxTicks = 4
                        break
                    case HistoryDataProps.SEVEN_DAYS:
                    case HistoryDataProps.ONE_MONTH:
                        xMaxTicks = 6
                        break
                }
            }
        }
    }

    onMount(() => {
        const profileCurrency: AvailableExchangeRates = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD
        Object.values(CurrencyTypes).forEach((currency) => {
            if (currency !== CurrencyTypes.IOTA) {
                currencyDropdownItems.push({
                    value: currency.toUpperCase(),
                    label: currency.toUpperCase(),
                })
            }
        })

        if (!CurrencyTypes[profileCurrency]) {
            currencyDropdownItems.push({ value: profileCurrency, label: profileCurrency })
        }
        // change to USD if previously selected currency is not in the list anymore
        if (!currencyDropdownItems.some(({ value }) => value === $activeProfile?.settings.chartSelectors.currency)) {
            updateProfile('settings.chartSelectors.currency', AvailableExchangeRates.USD)
        }

        Object.values(WalletChartType).forEach((chartType) => {
            chartTypeDropdownItems.push({
                value: chartType,
                label: localize(`charts.${chartType}`),
            })
        })
    })

    function handleWalletChartTypeSelect({ value: chart }) {
        selectedWalletChart.set(chart)
    }

    function handleCurrencySelect({ value: currency }) {
        updateProfile('settings.chartSelectors.currency', currency)
    }

    function formatYAxis(value) {
        return formatCurrencyValue(
            value,
            $selectedAccountStore && $selectedWalletChart === WalletChartType.HOLDINGS
                ? CurrencyTypes.IOTA
                : $activeProfile?.settings.chartSelectors.currency
                ? $activeProfile?.settings.chartSelectors.currency
                : '',
            undefined,
            undefined,
            5
        )
    }
</script>

<div data-label="line-chart" class="flex flex-col justify-between w-full h-full px-6 py-4">
    <div class="flex justify-between items-center mb-2">
        <div class="flex space-x-4 -ml-3">
            <Dropdown
                small
                value={localize(`charts.${$selectedWalletChart}`)}
                items={chartTypeDropdownItems}
                onSelect={handleWalletChartTypeSelect}
                contentWidth={true}
                valueTextType="h5"
                showBorderWhenClosed={false}
            />
        </div>
        <div class="flex justify-between items-center space-x-2">
            {#if $selectedWalletChart === WalletChartType.HOLDINGS}
                <span>
                    <Dropdown
                        small
                        value={tokenDropdownItems[0].label}
                        items={tokenDropdownItems}
                        contentWidth={true}
                    />
                </span>
            {:else}
                <span>
                    <Dropdown
                        small
                        value={$activeProfile?.settings.chartSelectors.currency}
                        items={currencyDropdownItems}
                        onSelect={handleCurrencySelect}
                        contentWidth={true}
                    />
                </span>
            {/if}
            <span>
                <Dropdown
                    small
                    value={$activeProfile?.settings.chartSelectors.timeframe
                        ? localize(
                              `charts.timeframe${TIMEFRAME_MAP[$activeProfile?.settings.chartSelectors.timeframe]}`
                          )
                        : undefined}
                    items={Object.keys(TIMEFRAME_MAP).map((value) => ({
                        label: localize(`charts.timeframe${TIMEFRAME_MAP[value]}`),
                        value,
                    }))}
                    onSelect={(newTimeframe) => updateProfile('settings.chartSelectors.timeframe', newTimeframe.value)}
                    contentWidth={true}
                />
            </span>
        </div>
    </div>
    <Chart
        type="line"
        {datasets}
        beginAtZero={$selectedAccountStore || $selectedDashboardChart !== DashboardChartType.TOKEN}
        {labels}
        {xMaxTicks}
        {formatYAxis}
        inlineStyle={$selectedAccountStore && `height: calc(50vh - ${hasTitleBar ? '190' : '160'}px);`}
    />
</div>

<style type="text/scss">
    button.active {
        @apply relative;
        &:after {
            content: '';
            @apply bg-blue-500;
            @apply w-full;
            @apply rounded;
            @apply h-0.5;
            @apply absolute;
            @apply -bottom-2.5;
            @apply left-0;
        }
    }
</style>
