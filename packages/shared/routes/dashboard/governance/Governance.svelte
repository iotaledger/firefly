<script lang="typescript">
    import { GovernanceHeader, GovernanceDashboard, GovernanceEventDetails } from './views'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { governanceRoute } from 'shared/lib/router'
    import { ParticipationEventState } from 'shared/lib/participation/types'

    const event = {
        title: 'Participate in community Treasury proposal',
        description: 'The future of IOTA is in your hands – you can decide the future of 63Ti unclaimed tokens by participating in this community proposal.\nYou can vote for building the community treasury or burning the unclaimed tokens.',
        status: ParticipationEventState.Upcoming,
        options: [
            {
                title: 'Build the community treasury',
                description: 'The IOTA community funds will be used by the community to support and fund projects and initiatives that are important to the IOTA community ecosystem'
            },
            {
                title: 'Burn the unclaimed tokens',
                description: 'The tokens will be removed from the IOTA Ledger and the total supply of IOTA tokens will decrease by the number of tokens that have been held in the treasury.'
            },
        ]
    }
</script>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap px-10 py-8 flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $governanceRoute === GovernanceRoutes.Init}
        <GovernanceHeader />
        <GovernanceDashboard {event} />
    {:else if $governanceRoute === GovernanceRoutes.EventDetails}
        <GovernanceEventDetails {event} />
    {/if}
</div>
