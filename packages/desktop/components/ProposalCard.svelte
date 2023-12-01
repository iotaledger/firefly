<script lang="ts">
    import { onMount } from 'svelte'

    import { ProposalStatusInfo } from '@components'
    import { Text, TooltipIcon } from '@ui'
    import { FontWeight, Position } from '@ui/enums'

    import { appSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { GovernanceRoute, governanceRouter } from '@core/router'

    import { ProposalStatus } from '@contexts/governance/enums'
    import { IProposal } from '@contexts/governance/interfaces'
    import { participationOverviewForSelectedWallet, selectedProposalId } from '@contexts/governance/stores'
    import { isVotingForProposal } from '@contexts/governance/utils'

    import { Icon } from '@auxiliary/icon/enums'

    export let proposal: IProposal

    let hasVoted = false

    $: $participationOverviewForSelectedWallet, setHasVoted()
    $: dark = $appSettings.darkMode

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
    class:dark
    class:ended={proposal?.status === ProposalStatus.Ended}
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

<style lang="scss">
    proposal-card.ended,
    proposal-card.dark.ended {
        @apply bg-transparent;
    }
</style>
