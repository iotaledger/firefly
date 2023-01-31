<script lang="ts">
    import { DetailsView, ProposalsView } from './views'
    import { selectedAccount } from '@core/account'
    import { GovernanceRoute, governanceRoute } from '@core/router'
</script>

{#if $selectedAccount}
    {#if $governanceRoute === GovernanceRoute.Proposals}
        <ProposalsView />
    {:else if $governanceRoute === GovernanceRoute.Details}
        <DetailsView />
    {/if}
{/if}
