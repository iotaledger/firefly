<script lang="typescript">
    import { LineChart, BarChart } from 'shared/components'

    enum ChartType {
        Line = 'line',
        Bar = 'bar',
    }

    export let type: ChartType
    export let data
    export let labels
    export let color
</script>

{#if type === ChartType.Line}
    <LineChart {labels} {data} {color} />
{:else if type === ChartType.Bar}
    <BarChart />
{/if}
