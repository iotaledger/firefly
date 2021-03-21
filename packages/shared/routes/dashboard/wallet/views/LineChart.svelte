<script lang="typescript">
    import { Chart, Dropdown, Text } from 'shared/components'
    import {
        chartCurrency,
        ChartData,
        chartTimeframe,
        DashboardChartType,
        getAccountValueData,
        getPortfolioData,
        getTokenData,
        selectedChart,
    } from 'shared/lib/chart'
    import { CurrencyTypes, formatCurrencyValue } from 'shared/lib/currency'
    import { HistoryDataProps, TIMEFRAME_MAP } from 'shared/lib/marketData'
    import { activeProfile } from 'shared/lib/profile'
    import type { BalanceHistory, WalletAccount } from 'shared/lib/wallet'
    import { getContext, onMount } from 'svelte'
    import type { Readable } from 'svelte/store'

    export let locale

    const walletBalanceHistory = getContext<Readable<BalanceHistory>>('walletBalanceHistory')
    const accountsBalanceHistory = getContext<Readable<BalanceHistory>>('accountsBalanceHistory')
    const selectedAccount = getContext<Readable<WalletAccount>>('selectedAccount')

    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    let currencyDropdown = []
    let xMaxTicks

    $: datasets = [{ data: chartData.data, tooltips: chartData.tooltips }]
    $: labels = chartData.labels
    $: color = $selectedAccount ? $selectedAccount.color : 'blue'

    /** Chart data */
    $: {
        if (locale || $selectedChart || $chartCurrency || $chartTimeframe || $walletBalanceHistory) {
            // Account value chart
            if ($selectedAccount) {
                chartData = getAccountValueData($accountsBalanceHistory[$selectedAccount.index])
                switch ($chartTimeframe) {
                    case HistoryDataProps.ONE_HOUR:
                    case HistoryDataProps.TWENTY_FOUR_HOURS:
                        xMaxTicks = 4
                        break
                    case HistoryDataProps.SEVEN_DAYS:
                    case HistoryDataProps.ONE_MONTH:
                        xMaxTicks = 6
                        break
                }
            } else {
                // Token value chart
                if ($selectedChart === DashboardChartType.TOKEN) {
                    chartData = getTokenData()
                }
                // Portfolio value chart
                if ($selectedChart === DashboardChartType.PORTFOLIO) {
                    chartData = getPortfolioData($walletBalanceHistory)
                }
                xMaxTicks = undefined
            }
        }
    }

    onMount(() => {
        let profileCurrency = $activeProfile?.settings.currency ?? CurrencyTypes.USD
        currencyDropdown = Object.values(CurrencyTypes).map((currency) => ({ value: currency, label: currency.toUpperCase() }))
        if (!CurrencyTypes[profileCurrency]) {
            currencyDropdown.push({ value: profileCurrency.toLocaleLowerCase(), label: profileCurrency })
        }
    })

    function handleCurrencySelect({ value: currency }) {
        chartCurrency.set(currency)
    }
</script>

<div data-label="line-chart" class="flex flex-col justify-between w-full h-full px-8 py-4">
    <div class="flex justify-between items-center mb-2">
        {#if !$selectedAccount}
            <div class="flex space-x-4">
                {#each Object.values(DashboardChartType) as chart}
                    <button on:click={() => selectedChart.set(chart)}>
                        <Text type="h4" disabled={chart !== $selectedChart}>{locale(`charts.${chart}`)}</Text>
                    </button>
                {/each}
            </div>
        {:else}
            <Text type="h4" classes="break-all mr-2">{locale('charts.accountValue')}</Text>
        {/if}
        <div class="flex space-x-2">
            <span>
                <Dropdown small value={$chartCurrency.toUpperCase()} items={currencyDropdown} onSelect={handleCurrencySelect} />
            </span>
            <span>
                <Dropdown
                    small
                    value={TIMEFRAME_MAP[$chartTimeframe]}
                    items={Object.keys(TIMEFRAME_MAP).map((value) => ({ label: TIMEFRAME_MAP[value], value }))}
                    onSelect={(newTimeframe) => chartTimeframe.set(newTimeframe.value)} />
            </span>
        </div>
    </div>
    <Chart
        type="line"
        {datasets}
        beginAtZero={$selectedAccount || $selectedChart !== DashboardChartType.TOKEN}
        {labels}
        {color}
        {xMaxTicks}
        formatYAxis={(value) => formatCurrencyValue(value, $chartCurrency, undefined, undefined, 5)}
        inlineStyle={$selectedAccount && 'height: calc(50vh - 150px);'} />
</div>
