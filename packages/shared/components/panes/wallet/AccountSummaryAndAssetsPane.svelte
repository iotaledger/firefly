<script lang="typescript">
    import { AccountSummary, AssetsPane, Pane } from 'shared/components'
    import features from 'shared/features/features'
</script>

<Pane classes=" h-full flex flex-auto flex-col flex-shrink-0">
    {#if features?.wallet?.accountSummaryAndAssets?.enabled}
        <AccountSummary />
        <AssetsPane />
    {/if}
</Pane>
