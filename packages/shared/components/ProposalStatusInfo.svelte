<script lang="ts">
    import { IProposal } from '@contexts/governance/interfaces'
    import { ProposalStatusPill, ProposalStatusTimelineTooltip } from 'shared/components'
    import { Position } from 'shared/components/enums'

    export let proposal: IProposal
    export let position: Position = Position.Right

    let anchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<div bind:this={anchor} on:mouseenter={() => showTooltip(true)} on:mouseleave={() => showTooltip(false)}>
    <ProposalStatusPill status={proposal?.status} />
</div>
{#if isTooltipVisible}
    <ProposalStatusTimelineTooltip bind:anchor milestones={proposal.milestones} status={proposal?.status} {position} />
{/if}
