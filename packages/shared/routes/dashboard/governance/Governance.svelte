<script lang="typescript">
    import { governanceRoute, governanceRouter } from '@core/router'
    import { GovernanceRoute } from '@core/router/enums'
    import { TREASURY_VOTE_EVENT_ID } from 'shared/lib/participation/constants'
    import { participationEvents } from 'shared/lib/participation/stores'
    import { selectedAccountStore } from 'shared/lib/wallet'
    import { GovernanceDashboard, GovernanceEventDetails } from './views'

    $: event = $participationEvents?.find((p) => p?.eventId === TREASURY_VOTE_EVENT_ID)

    $: {
        if (!event) {
            $governanceRouter.reset()
        }
    }
</script>

<div class="governance-wrapper w-full h-full flex flex-col flex-nowrap p-10 flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $governanceRoute === GovernanceRoute.Init}
        <GovernanceDashboard {event} account={$selectedAccountStore} />
    {:else if $governanceRoute === GovernanceRoute.EventDetails}
        <GovernanceEventDetails {event} account={$selectedAccountStore} />
    {/if}
</div>
