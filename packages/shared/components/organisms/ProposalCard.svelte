<script lang="ts">
    import { onMount } from 'svelte'
    import { ProposalStatusInfo, Text, TooltipIcon } from 'shared/components'
    import { Icon } from '@auxiliary/icon/enums'
    import { localize } from '@core/i18n'
    import { GovernanceRoute, governanceRouter } from '@core/router'
    import { IProposal } from '@contexts/governance/interfaces'
    import { participationOverviewForSelectedAccount, selectedProposal } from '@contexts/governance/stores'
    import { GovernanceLoadingState, ProposalStatus } from '@contexts/governance/enums'
    import { isVotingForProposal } from '@contexts/governance/utils'

    import { FontWeight, Position } from '../enums'
    import { governanceLoadingState } from '@contexts/governance/stores/governance-loading-state.store'

    export let proposal: IProposal

    let hasVoted = false

    $: loadingCompleted = $governanceLoadingState === GovernanceLoadingState.Completed
    $: $participationOverviewForSelectedAccount, setHasVoted()

    function setHasVoted(): void {
        hasVoted = isVotingForProposal(proposal?.id)
    }

    function onProposalClick(): void {
        if (!loadingCompleted) {
            return
        }
        $selectedProposal = proposal
        $governanceRouter.goTo(GovernanceRoute.Details)
    }

    onMount(() => setHasVoted())
</script>

<proposal-card
    on:click={onProposalClick}
    on:keydown={(e) => e.key === 'Enter' && onProposalClick()}
    class="flex flex-col p-6 border border-solid border-gray-200 dark:border-transparent rounded-xl shadow-elevation-1 focus:shadow-inner
    {proposal?.state?.status === ProposalStatus.Ended && loadingCompleted
        ? 'bg-transparent'
        : 'bg-white dark:bg-gray-850'}
    {loadingCompleted ? 'cursor-pointer' : 'animate-pulse'}"
    style="height: 109px"
>
    {#if loadingCompleted}
        <div class="flex items-center gap-1.5 mb-4">
            {#if proposal.organization}
                <TooltipIcon
                    icon={proposal.organization.icon}
                    text={proposal.organization.name}
                    size="small"
                    classes="p-0.5 rounded-full bg-black text-white"
                    iconClasses="text-white"
                />
            {/if}
            <Text fontWeight={FontWeight.semibold} fontSize="14" classes="truncate" lineHeight="5"
                >{proposal.title}</Text
            >
        </div>
        <div class="flex justify-between items-center" style="height: 23px;">
            <ProposalStatusInfo status={proposal?.state?.status} milestones={proposal.milestones} />
            {#if hasVoted}
                <TooltipIcon
                    text={localize('views.governance.proposals.voted')}
                    icon={Icon.Voted}
                    size="small"
                    position={Position.Left}
                    iconClasses="text-gray-500"
                />
            {/if}
        </div>
    {/if}
</proposal-card>
