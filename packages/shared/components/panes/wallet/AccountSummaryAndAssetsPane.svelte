<script lang="typescript">
    import { AccountSummary, AssetsPane, Pane } from 'shared/components'
    import featureFlags from 'shared/featureFlags.config'
</script>

<Pane classes=" h-full flex flex-auto flex-col flex-shrink-0">
    {#if featureFlags?.wallet?.accountSummaryAndAssets?.enabled}
        <AccountSummary />
        <AssetsPane />
    {/if}
</Pane>
