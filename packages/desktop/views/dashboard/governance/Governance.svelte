<script lang="ts">
    import { GovernanceDashboardView, ProposalDetailsView } from './views'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { GovernanceRoute, governanceRoute, governanceRouter } from '@core/router'

    /**
     * NOTE: We add one to the selectedAccountIndex because
     * switching to the first account (index = 0) would evaluate
     * to false, causing the router to never be reset.
     */
    $: $selectedAccountIndex + 1 && $governanceRouter.reset()
</script>

{#if $selectedAccount}
    {#if $governanceRoute === GovernanceRoute.Proposals}
        <GovernanceDashboardView />
    {:else if $governanceRoute === GovernanceRoute.Details}
        <ProposalDetailsView />
    {/if}
{/if}
