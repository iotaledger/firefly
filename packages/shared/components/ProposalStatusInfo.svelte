<script lang="ts">
    import {
        ProposalStatusPill,
        ProposalStatusTimelineTooltip,
        OutdatedNodeTooltip,
        ResultsNotAvailableTooltip,
    } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { IProposal } from '@contexts/governance/interfaces'
    import { ProposalError } from '../lib/contexts/governance'

    export let proposal: IProposal
    export let position: Position = Position.Right

    let anchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<div bind:this={anchor} on:mouseenter={() => showTooltip(true)} on:mouseleave={() => showTooltip(false)}>
    <ProposalStatusPill status={proposal?.status} error={proposal?.error} />
</div>
{#if isTooltipVisible}
    {#if proposal?.error}
        {#if proposal?.error === ProposalError.NodeOutdated}
            <OutdatedNodeTooltip bind:anchor {position} />
        {:else if proposal?.error === ProposalError.ResultsNotAvailable}
            <ResultsNotAvailableTooltip bind:anchor {position} />
        {/if}
    {:else}
        <ProposalStatusTimelineTooltip
            bind:anchor
            milestones={proposal.milestones}
            status={proposal?.status}
            {position}
        />
    {/if}
{/if}
