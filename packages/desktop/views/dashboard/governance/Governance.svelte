<script lang="ts">
    import { DetailsView, ProposalsView } from './views'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { GovernanceRoute, governanceRoute, governanceRouter } from '@core/router'

    $: $selectedAccountIndex + 1 && $governanceRouter.reset()
</script>

{#if $selectedAccount}
    {#if $governanceRoute === GovernanceRoute.Proposals}
        <ProposalsView />
    {:else if $governanceRoute === GovernanceRoute.Details}
        <DetailsView />
    {/if}
{/if}
