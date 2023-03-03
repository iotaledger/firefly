<script lang="ts">
    import { IProposal } from '@contexts/governance/interfaces'
    import { ProposalStatusPill, ProposalStatusTimelineTooltip, OutdatedNodeTooltip } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { Icon } from '../lib/auxiliary/icon'

    export let proposal: IProposal
    export let position: Position = Position.Right

    const isNodeOutdated = proposal?.isNodeOutdated

    let anchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<div bind:this={anchor} on:mouseenter={() => showTooltip(true)} on:mouseleave={() => showTooltip(false)}>
    <ProposalStatusPill status={proposal?.status} isNodeOutdated={proposal?.isNodeOutdated} icon={Icon.StatusError} />
</div>
{#if isTooltipVisible}
    {#if isNodeOutdated}
        <OutdatedNodeTooltip bind:anchor {position} />
    {:else}
        <ProposalStatusTimelineTooltip
            bind:anchor
            milestones={proposal.milestones}
            status={proposal?.status}
            {position}
        />
    {/if}
{/if}
