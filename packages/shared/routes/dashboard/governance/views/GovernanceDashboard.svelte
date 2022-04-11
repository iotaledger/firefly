<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { GovernanceVotingPower, GovernanceInfo, GovernanceEvents } from './'
    import { ParticipationEvent } from 'shared/lib/participation/types'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let event: ParticipationEvent
    export let account: WalletAccount
</script>

<div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
    <div class="h-full flex flex-col space-y-3 overflow-hidden">
        <DashboardPane classes="w-full flex-shrink-0 p-6">
            <GovernanceVotingPower {account} />
        </DashboardPane>
        <DashboardPane classes="w-full flex-grow p-6">
            <GovernanceInfo />
        </DashboardPane>
    </div>
    <DashboardPane classes="w-full h-full p-6 col-span-2 flex flex-col items-center">
        <GovernanceEvents {event} />
    </DashboardPane>
</div>
