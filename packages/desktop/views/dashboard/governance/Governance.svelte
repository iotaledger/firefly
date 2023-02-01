<script lang="ts">
    import { GovernanceDashboardView, ProposalDetailsView } from './views'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { GovernanceRoute, governanceRoute, governanceRouter } from '@core/router'

    $: $selectedAccountIndex !== undefined && $governanceRouter.reset()
</script>

{#if $selectedAccount}
    {#if $governanceRoute === GovernanceRoute.Proposals}
        <GovernanceDashboardView />
    {:else if $governanceRoute === GovernanceRoute.Details}
        <ProposalDetailsView />
    {/if}
{/if}
