<script lang="typescript">
    import { onMount, getContext } from 'svelte'
    import { Dropdown, Chart, Text } from 'shared/components'
    import { TIMEFRAME_MAP } from 'shared/lib/marketData'
    import { CurrencyTypes } from 'shared/lib/currency'
    import { activeProfile } from 'shared/lib/profile'
    import type { ChartData } from 'shared/lib/chart'
    import {
        DashboardChartType,
        getPortfolioData,
        getTokenData,
        getAccountValueData,
        chartCurrency,
        selectedChart,
        chartTimeframe,
    } from 'shared/lib/chart'

    export let locale

    const walletBalanceHistory = getContext('walletBalanceHistory')
    const accountsBalanceHistory = getContext('accountsBalanceHistory')
    const selectedAccount = getContext('selectedAccount')

    let chartData: ChartData = { labels: [], data: [], tooltips: [] }
    let currencyDropdown = []

    $: data = chartData.data
    $: labels = chartData.labels
    $: tooltips = chartData.tooltips
    $: color = $selectedAccount ? $selectedAccount.color : 'blue'

    /** Chart data */
    $: {
        if ($selectedChart || $chartCurrency || $chartTimeframe || $walletBalanceHistory) {
            // Account value chart
            if ($selectedAccount) {
                chartData = getAccountValueData($accountsBalanceHistory[$selectedAccount.index])
            } else {
                // Token value chart
                if ($selectedChart === DashboardChartType.TOKEN) {
                    chartData = getTokenData()
                }
                // Portfolio value chart
                if ($selectedChart === DashboardChartType.PORTFOLIO) {
                    chartData = getPortfolioData($walletBalanceHistory)
                }
            }
        }
    }

    onMount(() => {
        let profileCurrency = $activeProfile.settings.currency
        currencyDropdown = Object.values(CurrencyTypes).map((currency) => ({ value: currency, label: currency.toUpperCase() }))
        if (!CurrencyTypes[profileCurrency]) {
            currencyDropdown.push({ value: profileCurrency.toLocaleLowerCase(), label: profileCurrency })
        }
    })

    function handleCurrencySelect({ value: currency }) {
        chartCurrency.set(currency)
    }
</script>

<div data-label="portfolio-token-chart" class="w-full h-full px-8 py-4">
    <div class="flex justify-between items-center mb-2">
        {#if !$selectedAccount}
            <div class="flex space-x-4">
                {#each Object.values(DashboardChartType) as chart, idx}
                    <button on:click={() => selectedChart.set(chart)}>
                        <Text type="h4" disabled={chart !== $selectedChart}>{chart}</Text>
                    </button>
                {/each}
            </div>
        {:else}
            <Text type="h4">{locale('general.account_value')}</Text>
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
    <div class="flex-auto">
        <Chart type="line" {data} {labels} {tooltips} {color} />
    </div>
</div>
