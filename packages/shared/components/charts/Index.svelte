<script lang="typescript">
    import { LineChart, BarChart } from 'shared/components'

    enum ChartType {
        Line = 'line',
        Bar = 'bar',
    }

    export let type: ChartType
    export let datasets
    export let labels
    export let tooltips
    export let color
    export let xMaxTicks
    export let yMaxTicks
    export let yPrecision
</script>

{#if type === ChartType.Line}
    <LineChart {datasets} {labels} {tooltips} {xMaxTicks} {yMaxTicks} {yPrecision} {color} />
{:else if type === ChartType.Bar}
    <BarChart {datasets} {labels} {tooltips} />
{/if}
