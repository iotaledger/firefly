<script lang="typescript">
    import { onMount, getContext } from 'svelte'
    import { Dropdown, Chart, Text } from 'shared/components'
    import {
        priceData,
        selectedChart,
        chartCurrency,
        chartTimeframe,
        TIMEFRAME_MAP,
        AvailableCharts,
    } from 'shared/lib/marketData'
    import { CurrencyTypes } from 'shared/lib/currency'
    import { activeProfile } from 'shared/lib/profile'

    export let locale

    let chartData = { data: [], labels: [] }
    let data = []
    let labels = []
    let currencyDropdown = []

    $: color = $selectedAccount ? $selectedAccount.color : 'blue'
    $: data = chartData.data
    $: labels = chartData.labels

    /** Chart data */
    $: if ($selectedChart || $priceData || $chartCurrency || $chartTimeframe || $selectedAccount) {
        // sort price from last to newest
        const fiatData = $priceData[$chartCurrency][$chartTimeframe].sort((a, b) => a[0] - b[0])
        if ($selectedAccount) {
            chartData = $accountsBalanceHistory[$selectedAccount.index][$chartTimeframe].reduce(
                (acc, values, index) => {
                    const fiatBalance = ((values.balance * fiatData[index][1]) / 1000000).toFixed(5)
                    acc.labels.push(new Date(values.timestamp * 1000))
                    acc.data.push(fiatBalance)
                    return acc
                },
                { labels: [], data: [] }
            )
        } else {
            if ($selectedChart === AvailableCharts.TOKEN) {
                chartData = $priceData[$chartCurrency][$chartTimeframe]
                    .sort((a, b) => a[0] - b[0])
                    .reduce(
                        (acc, values) => {
                            acc.labels.push(new Date(values[0] * 1000))
                            acc.data.push(parseFloat(values[1]))
                            return acc
                        },
                        { labels: [], data: [] }
                    )
            } else if ($selectedChart === AvailableCharts.PORTFOLIO) {
                chartData = $walletBalanceHistory[$chartTimeframe].reduce(
                    (acc, values, index) => {
                        const fiatBalance = ((values.balance * fiatData[index][1]) / 1000000).toFixed(5)
                        acc.labels.push(new Date(values.timestamp * 1000))
                        acc.data.push(fiatBalance)
                        return acc
                    },
                    { labels: [], data: [] }
                )
            }
        }
    }

    const walletBalanceHistory = getContext('walletBalanceHistory')
    const accountsBalanceHistory = getContext('accountsBalanceHistory')
    const selectedAccount = getContext('selectedAccount')

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
                {#each Object.values(AvailableCharts) as chart, idx}
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
        <Chart type="line" {labels} {data} {color} />
    </div>
</div>
