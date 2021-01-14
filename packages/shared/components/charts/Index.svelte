<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { LineChart, BarChart } from 'shared/components'
    import { chartData } from 'shared/lib/marketData'

    enum ChartType {
        Line = 'line',
        Bar = 'bar',
    }

    let data: any[]
    let labels: string[]

    // TODO (laumair): Should be an enum
    export let timeframe: string = '7d'
    export let currency: string = 'usd'

    export let type: ChartType

    const unsubscribe = chartData.subscribe((_chartData) => {
        labels = _chartData.labels
        data = _chartData.data
    })

    onDestroy(unsubscribe)
</script>

{#if type === ChartType.Line}
    <LineChart {labels} {data} />
{:else if type === ChartType.Bar}
    <BarChart />
{/if}
