<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { ParticipationEvent } from 'shared/lib/participation/types'
    import { GovernanceEvents, GovernanceInfo, GovernanceVotingWeight } from './'

    export let event: ParticipationEvent
</script>

<div class="w-full h-full flex flex-col flex-nowrap flex-1 bg-gray-50 dark:bg-gray-900">
    <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
        <div class="h-full flex flex-col space-y-3 min-h-0">
            <DashboardPane classes="w-full flex-shrink-0">
                <GovernanceVotingWeight />
            </DashboardPane>
            <DashboardPane classes="w-full flex-grow">
                <GovernanceInfo />
            </DashboardPane>
        </div>
        <DashboardPane classes="w-full h-full col-span-2">
            <GovernanceEvents {event} />
        </DashboardPane>
    </div>
</div>
