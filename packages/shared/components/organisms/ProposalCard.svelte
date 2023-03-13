<script lang="ts">
    import { onMount } from 'svelte'
    import { ProposalStatusInfo, Text, TooltipIcon } from 'shared/components'
    import { Icon } from '@auxiliary/icon/enums'
    import { localize } from '@core/i18n'
    import { GovernanceRoute, governanceRouter } from '@core/router'
    import { IProposal } from '@contexts/governance/interfaces'
    import { participationOverviewForSelectedAccount, selectedProposalId } from '@contexts/governance/stores'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { isVotingForProposal } from '@contexts/governance/utils'

    import { FontWeight, Position } from '../enums'

    export let proposal: IProposal

    let hasVoted = false
    $: $participationOverviewForSelectedAccount, setHasVoted()

    function setHasVoted(): void {
        hasVoted = isVotingForProposal(proposal?.id)
    }

    function onProposalClick(): void {
        $selectedProposalId = proposal?.id
        $governanceRouter.goTo(GovernanceRoute.Details)
    }

    onMount(() => setHasVoted())
</script>

<proposal-card
    on:click={onProposalClick}
    on:keydown={(e) => e.key === 'Enter' && onProposalClick()}
    class="flex flex-col p-6 border border-solid border-gray-200 dark:border-transparent rounded-xl cursor-pointer h-fit shadow-elevation-1 focus:shadow-inner
    {proposal?.status === ProposalStatus.Ended ? 'bg-transparent dark:bg-gray-850' : 'bg-white dark:bg-gray-800'}"
>
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
        <Text fontWeight={FontWeight.semibold} fontSize="14" classes="truncate" lineHeight="5">{proposal.title}</Text>
    </div>
    <div class="flex justify-between items-center">
        <ProposalStatusInfo {proposal} />
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
</proposal-card>
