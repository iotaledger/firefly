<script lang="typescript">
    import { onMount } from 'svelte'
    import { ProposalStatusInfo, Text, TooltipIcon } from 'shared/components'
    import { Icon } from '@auxiliary/icon/enums'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile/stores'
    import { GovernanceRoute, governanceRouter } from '@core/router'
    import { IProposal } from '@contexts/governance/interfaces'
    import { selectedProposal, proposalsState } from '@contexts/governance/stores'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { isVotingForProposal } from '@contexts/governance/utils'

    import { FontWeight, Position } from '../enums'

    export let proposal: IProposal

    $: proposalState = $proposalsState[$activeProfileId]?.[proposal?.id]?.state

    let hasVoted = false

    async function setHasVoted(): Promise<void> {
        hasVoted = await isVotingForProposal(proposal?.id)
    }

    function handleProposalClick(): void {
        $selectedProposal = proposal
        $governanceRouter.goTo(GovernanceRoute.Details)
    }

    onMount(() => void setHasVoted())
</script>

<proposal-card
    on:click={handleProposalClick}
    class="flex flex-col p-6 border border-solid border-gray-200 dark:border-transparent rounded-xl cursor-pointer h-32
    {proposal.status === ProposalStatus.Ended ? 'bg-transparent' : 'bg-white dark:bg-gray-850'}"
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
        <ProposalStatusInfo status={proposalState?.status} milestones={proposal.milestones} />
        {#if hasVoted}
            {@const icon = proposal.status === ProposalStatus.Commencing ? Icon.History : Icon.Voted}
            <TooltipIcon {icon} size="small" position={Position.Left} iconClasses="text-gray-500">
                <Text smaller overrideColor fontWeight={FontWeight.semibold} classes="text-gray-600">
                    {localize('views.governance.proposals.voted')}
                </Text>
            </TooltipIcon>
        {/if}
    </div>
</proposal-card>
