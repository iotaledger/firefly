<script lang="ts">
    import { ProposalStatusTimelineTooltip } from '@components'
    import { OutdatedNodeTooltip, ProposalStatusPill, Text, Tooltip } from '@ui'
    import { FontWeight, Position } from '@ui/enums'

    import { IProposal } from '@contexts/governance/interfaces'
    import { localize } from '@core/i18n'
    import { ProposalError } from '@lib/contexts/governance'

    export let proposal: IProposal
    export let position: Position = Position.Right

    let anchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }

    function handleMouseEnter(): void {
        showTooltip(true)
    }

    function handleMouseLeave(): void {
        showTooltip(false)
    }
</script>

<div bind:this={anchor} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
    <ProposalStatusPill {proposal} />
</div>
{#if isTooltipVisible}
    {#if proposal?.error}
        {#if proposal?.error === ProposalError.NodeOutdated}
            <OutdatedNodeTooltip bind:anchor {position} />
        {:else if proposal?.error === ProposalError.ResultsNotAvailable}
            <Tooltip {anchor} {position}>
                <div class="flex flex-col text-left">
                    <Text fontWeight={FontWeight.semibold} fontSize="16" classes="mb-2">
                        {localize('tooltips.governance.resultsNotAvailable.title')}
                    </Text>
                    <Text fontWeight={FontWeight.normal}>
                        {localize('tooltips.governance.resultsNotAvailable.body')}
                    </Text>
                </div>
            </Tooltip>
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
