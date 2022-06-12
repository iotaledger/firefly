<script>
    import { Pane, LineChart } from 'shared/components'
    import featureFlags from 'shared/featureFlags.config'
</script>

<Pane classes="w-full h-1/2">
    {#if featureFlags?.wallet?.portfolioChart?.enabled}
        <LineChart />
    {/if}
</Pane>
