<script lang="typescript">
    import { onMount, getContext } from 'svelte'
    import { Unit, convertUnits } from '@iota/unit-converter'
    import { Dropdown, Chart, Text } from 'shared/components'
    import {
        priceData,
        selectedChart,
        chartCurrency,
        chartTimeframe,
        TIMEFRAME_MAP,
        AvailableCharts,
    } from 'shared/lib/marketData'
    import { CurrencyTypes, exchangeRates, convertToFiat, currencies } from 'shared/lib/currency'
    import { activeProfile } from 'shared/lib/profile'

    let chartData = { data: [], labels: [] }
    let data = []
    let labels = []
    let currencyDropdown = []

    $: color = $selectedAccount ? $selectedAccount.color : 'blue'
    $: data = chartData.data
    $: labels = chartData.labels

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

    /** Chart data */
    $: if ($selectedChart || $priceData || $chartCurrency || $chartTimeframe || $selectedAccount) {
        const fiatData = $priceData[$chartCurrency][$chartTimeframe].sort((a, b) => a[1] - b[1])
        console.log(fiatData)
        if ($selectedAccount) {
            chartData = $accountsBalanceHistory[$selectedAccount.index][$chartTimeframe]
                .sort((a, b) => a.timestamp - b.timestamp)
                .reduce(
                    (acc, values, index) => {
                        console.log('values.balance', values.balance)
                        console.log('fiatData[index][1]', fiatData[index][1])
                        const fiatBalance = convertToFiat(values.balance, $currencies[CurrencyTypes.USD], fiatData[index][1]) // TODO: doesnt work with ETH and BTC
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
                chartData = $walletBalanceHistory[$chartTimeframe]
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .reduce(
                        (acc, values, index) => {
                            const fiatBalance = convertToFiat(values.balance, $currencies[CurrencyTypes.USD], fiatData[index][1]) // TODO: doesnt work with ETH and BTC
                            acc.labels.push(new Date(values.timestamp * 1000))
                            acc.data.push(fiatBalance)
                            return acc
                        },
                        { labels: [], data: [] }
                    )
            }
        }
    }
</script>

<div data-label="portfolio-token-chart" class="w-full h-full px-10 pt-8 pb-6">
    <div class="flex justify-between">
        {#if !$selectedAccount}
            <div class="flex">
                {#each Object.values(AvailableCharts) as chart, idx}
                    <span on:click={() => selectedChart.set(chart)}>
                        <Text type="h4" disabled={chart !== $selectedChart} classes={idx > 0 && 'ml-6'}>{chart}</Text>
                    </span>
                {/each}
            </div>
        {/if}
        <div class="flex">
            <span>
                <Dropdown value={$chartCurrency.toUpperCase()} items={currencyDropdown} onSelect={handleCurrencySelect} />
            </span>
            <span class="ml-6">
                <Dropdown
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
