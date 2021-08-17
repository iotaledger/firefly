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
    export let beginAtZero
    export let inlineStyle
    export let formatYAxis
</script>

{#if type === ChartType.Line}
    <LineChart
        {formatYAxis}
        {datasets}
        {labels}
        {tooltips}
        {xMaxTicks}
        {yMaxTicks}
        {yPrecision}
        {beginAtZero}
        {color}
        {inlineStyle}
    />
{:else if type === ChartType.Bar}
    <BarChart {formatYAxis} {datasets} {labels} {tooltips} {inlineStyle} />
{/if}
