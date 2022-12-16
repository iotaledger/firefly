<script lang="typescript">
    import { onMount } from 'svelte'
    import { DetailsView, ProposalsView } from './views'
    import { selectedAccount } from '@core/account'
    import { GovernanceRoute, governanceRoute } from '@core/router'
    import { pollProposalsState } from '@core/governance/actions'

    onMount(async () => {
        await pollProposalsState()
    })
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
