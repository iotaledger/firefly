<script lang="ts">
    import { GovernanceDashboardView, ProposalDetailsView } from './views'
    import { selectedWallet, selectedWalletId } from '@core/account/stores'
    import { GovernanceRoute, governanceRoute, governanceRouter } from '@core/router'

    $: $selectedWalletId !== undefined && $governanceRouter.reset()
</script>

{#if $selectedWallet}
    {#if $governanceRoute === GovernanceRoute.Proposals}
        <GovernanceDashboardView />
    {:else if $governanceRoute === GovernanceRoute.Details}
        <ProposalDetailsView />
    {/if}
{/if}
