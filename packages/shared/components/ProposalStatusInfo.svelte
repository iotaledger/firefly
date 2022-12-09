<script lang="typescript">
    import { ProposalStatusTimelineTooltip, ProposalStatusPill } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { ProposalStatus } from '@core/governance/enums'

    export let milestones: Record<ProposalStatus, number>
    export let status: ProposalStatus
    export let position: Position = Position.Right

    let anchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<div bind:this={anchor} on:mouseenter={() => showTooltip(true)} on:mouseleave={() => showTooltip(false)}>
    <ProposalStatusPill {status} />
</div>
{#if isTooltipVisible}
    <ProposalStatusTimelineTooltip bind:anchor {milestones} {status} {position} />
{/if}
