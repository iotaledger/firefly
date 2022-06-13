<script>
    import { Pane, BarChart } from 'shared/components'
    import featureFlags from 'shared/featureFlags.config'
</script>

<Pane classes="w-full h-1/2">
    {#if featureFlags?.wallet?.activityChart?.enabled}
        <BarChart />
    {/if}
</Pane>
