<script lang="typescript">
    import { AccountRoute, accountRoute } from '@core/router'
    import { ManageAccount } from 'shared/routes/dashboard/wallet/views'
    import { selectedAccount } from '@core/account'
    import { Pane, AccountSummary, AssetsPane } from 'shared/components'
</script>

<Pane classes=" h-full flex flex-auto flex-col flex-shrink-0">
    <AccountSummary />
    {#if $accountRoute === AccountRoute.Init}
        <AssetsPane />
    {:else if $accountRoute === AccountRoute.Manage}
        <!-- // TODO: turn this into a modal -->
        <ManageAccount alias={$selectedAccount.getAlias()} account={$selectedAccount} />
    {/if}
</Pane>
