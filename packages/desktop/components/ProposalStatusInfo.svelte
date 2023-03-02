<script lang="ts">
    import { ProposalStatusTimelineTooltip } from '@components'
    import { ProposalStatusPill } from '@ui'
    import { Position } from '@ui/enums'

    import { IProposal } from '@contexts/governance/interfaces'

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
