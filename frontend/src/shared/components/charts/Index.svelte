<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { LineChart, BarChart } from '@shared-components'
    import { chartData, priceData, chartTimeframe, chartCurrency } from '@shared-lib/marketData'

    enum ChartType {
        Line = 'line',
        Bar = 'bar'
    }

    let data: any[]
    let labels: string[]

    // TODO (laumair): Should be an enum
    export let timeframe: string = '7d'
    export let currency: string = 'usd'

    export let type: ChartType

    function prepareProps(priceData) {
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]

        return priceData[currency][timeframe]
            .sort((a, b) => a[0] - b[0])
            .reduce(
                (acc, values) => {
                    acc.labels.push(new Date(values[0] * 1000).toLocaleString('default', { month: 'short', day: 'numeric' }))
                    acc.data.push(parseFloat(values[1]))

                    return acc
                },
                { labels: [], data: [] }
            )
    }

    function updateProps(_priceData) {
        console.log('Called', _priceData)
        const props = prepareProps(_priceData)

        labels = props.labels
        data = props.data
    }

    const unsubscribe = chartData.subscribe((_chartData) => {
        labels = _chartData.labels;
        data = _chartData.data;
    })

    onDestroy(unsubscribe)
</script>

{#if type === ChartType.Line}
    <LineChart {labels} {data} />
{:else if type === ChartType.Bar}
    <BarChart />
{/if}
