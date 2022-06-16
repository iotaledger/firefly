<script>
    import { Pane, LineChart } from 'shared/components'
    import features from 'shared/features/features'
</script>

<Pane classes="w-full h-1/2">
    {#if features?.wallet?.portfolioChart?.enabled}
        <LineChart />
    {/if}
</Pane>
