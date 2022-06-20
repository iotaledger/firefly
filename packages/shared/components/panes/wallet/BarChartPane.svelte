<script>
    import { Pane, BarChart } from 'shared/components'
    import features from 'shared/features/features'
</script>

<Pane classes="w-full h-1/2">
    {#if features?.wallet?.activityChart?.enabled}
        <BarChart />
    {/if}
</Pane>
