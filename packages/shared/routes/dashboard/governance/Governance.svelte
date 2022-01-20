<script lang="typescript">
    import { GovernanceHeader, GovernanceDashboard, GovernanceEventDetails } from './views'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { governanceRoute } from 'shared/lib/router'
</script>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap px-10 py-8 flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $governanceRoute === GovernanceRoutes.Init}
        <GovernanceHeader />
        <GovernanceDashboard />
    {:else if $governanceRoute === GovernanceRoutes.EventDetails}
        <GovernanceEventDetails />
    {/if}
</div>
