<script lang="typescript">
    import { DetailsView, ProposalsView } from './views'
    import { selectedAccount } from '@core/account'
    import { GovernanceRoute, governanceRoute } from '@core/router'
</script>

{#if $selectedAccount}
    {#key $selectedAccount?.index}
        {#if $governanceRoute === GovernanceRoute.Proposals}
            <ProposalsView />
        {:else if $governanceRoute === GovernanceRoute.Details}
            <DetailsView />
        {/if}
    {/key}
{/if}
