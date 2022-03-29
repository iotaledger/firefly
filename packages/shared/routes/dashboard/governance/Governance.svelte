<script lang="typescript">
    import { GovernanceHeader, GovernanceDashboard, GovernanceEventDetails } from './views'
    import { governanceRoute } from '@core/router'
    import { GovernanceRoute } from '@core/router/enums'
    import { participationEvents } from 'shared/lib/participation/stores'
    import { selectedAccount } from 'shared/lib/wallet'
    import { TREASURY_VOTE_EVENT_ID } from 'shared/lib/participation/constants'

    $: event = $participationEvents?.find((p) => p?.eventId === TREASURY_VOTE_EVENT_ID)
</script>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap px-10 py-8 flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $governanceRoute === GovernanceRoute.Init}
        <div class="flex justify-between">
            <GovernanceHeader />
        </div>
        <GovernanceDashboard {event} account={$selectedAccount} />
    {:else if $governanceRoute === GovernanceRoute.EventDetails}
        <GovernanceEventDetails {event} account={$selectedAccount} />
    {/if}
</div>
