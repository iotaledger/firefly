<script lang="ts">
    import { GovernanceDashboardView, ProposalDetailsView } from './views'
    import { selectedAccount, selectedWalletId } from '@core/account/stores'
    import { GovernanceRoute, governanceRoute, governanceRouter } from '@core/router'

    $: $selectedWalletId !== undefined && $governanceRouter.reset()
</script>

{#if $selectedAccount}
    {#if $governanceRoute === GovernanceRoute.Proposals}
        <GovernanceDashboardView />
    {:else if $governanceRoute === GovernanceRoute.Details}
        <ProposalDetailsView />
    {/if}
{/if}
