<script lang="ts">
    import {
        ProposalStatusPill,
        ProposalStatusTimelineTooltip,
        OutdatedNodeTooltip,
        ResultsNotAvailableTooltip,
    } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { IProposal } from '@contexts/governance/interfaces'
    import { ProposalErrorMode } from '../lib/contexts/governance'

    export let proposal: IProposal
    export let position: Position = Position.Right

    let anchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<div bind:this={anchor} on:mouseenter={() => showTooltip(true)} on:mouseleave={() => showTooltip(false)}>
    <ProposalStatusPill status={proposal?.status} errorMode={proposal?.errorMode} />
</div>
{#if isTooltipVisible}
    {#if proposal?.errorMode}
        {#if proposal?.errorMode === ProposalErrorMode.NodeOutdated}
            <OutdatedNodeTooltip bind:anchor {position} />
        {:else if proposal?.errorMode === ProposalErrorMode.ResultsNotAvailable}
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
