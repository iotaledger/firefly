<script lang="typescript">
    import { ProposalStatusInfo, Text, TooltipIcon } from 'shared/components'
    import { IProposal } from '@core/governance/interfaces'
    import { selectedProposal } from '@core/governance/stores'
    import { ProposalStatus } from '@core/governance/enums'
    import { GovernanceRoute, governanceRouter } from '@core/router'

    import { FontWeight, Position } from '../enums'
    import { Icon } from '@auxiliary/icon/enums'
    import { localize } from '@core/i18n'

    export let proposal: IProposal

    function handleProposalClick(): void {
        $selectedProposal = proposal
        $governanceRouter.goTo(GovernanceRoute.Details)
    }
</script>

<proposal-card
    on:click={handleProposalClick}
    class="flex flex-col p-6 border border-solid border-gray-200 rounded-xl cursor-pointer h-32
    {proposal.status === ProposalStatus.Ended ? 'bg-transparent' : 'bg-white'}"
>
    <div class="flex items-center gap-1.5 mb-5">
        {#if proposal.organization}
            <TooltipIcon
                icon={proposal.organization.icon}
                size="small"
                classes="p-0.5 rounded-full bg-black text-white"
                iconClasses="text-white"
            >
                <Text smaller overrideColor fontWeight={FontWeight.semibold} classes="text-gray-600"
                    >{proposal.organization.name}</Text
                >
            </TooltipIcon>
        {/if}
        <Text fontWeight={FontWeight.semibold} fontSize="14" classes="truncate">{proposal.title}</Text>
    </div>
    <div class="flex justify-between items-center">
        <ProposalStatusInfo status={proposal.status} milestones={proposal.milestones} />
        {#if proposal.hasVoted}
            <TooltipIcon icon={Icon.Voted} size="small" position={Position.Left} iconClasses="text-gray-500">
                <Text smaller overrideColor fontWeight={FontWeight.semibold} classes="text-gray-600">
                    {localize('views.governance.proposals.voted')}
                </Text>
            </TooltipIcon>
        {/if}
    </div>
</proposal-card>
