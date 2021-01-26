<script lang="typescript">
    import { Dropdown, Chart, Text } from 'shared/components'
    import {
        selectedChart,
        CurrencyTypes,
        chartCurrency,
        chartTimeframe,
        TIMEFRAME_MAP,
        AvailableCharts,
    } from 'shared/lib/marketData'
</script>

<div data-label="portfolio-token-chart" class="w-full px-10 pt-8 pb-6">
    <div class="flex justify-between">
        <div class="flex">
            {#each Object.values(AvailableCharts) as chart, idx}
                <span on:click={() => selectedChart.set(chart)}>
                    <Text type="h4" disabled={chart !== $selectedChart} classes={idx > 0 && 'ml-6'}>{chart}</Text>
                </span>
            {/each}
        </div>
        <div class="flex">
            <span>
                <Dropdown
                    value={$chartCurrency.toUpperCase()}
                    items={Object.values(CurrencyTypes).map((currency) => ({ value: currency, label: currency.toUpperCase() }))}
                    onSelect={(newCurrency) => chartCurrency.set(newCurrency)} />
            </span>
            <span class="ml-6">
                <Dropdown
                    value={TIMEFRAME_MAP[$chartTimeframe]}
                    items={Object.keys(TIMEFRAME_MAP).map((value) => ({ label: TIMEFRAME_MAP[value], value }))}
                    onSelect={(newTimeframe) => chartTimeframe.set(newTimeframe)} />
            </span>
        </div>
    </div>
    <div class="flex-auto">
        <Chart type="line" />
    </div>
</div>
