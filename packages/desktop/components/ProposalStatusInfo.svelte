<script lang="ts">
    import { ProposalStatusTimelineTooltip } from '@components'
    import { InformationTooltip, ProposalStatusPill } from '@ui'
    import { Position } from '@ui/enums'

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

    function getProposalErrorText(proposal: IProposal): { title: string; body: string } {
        let title: string = ''
        let body: string = ''

        switch (proposal?.error) {
            case ProposalError.NodeOutdated:
                title = localize('tooltips.governance.outdatedNode.title')
                body = localize('tooltips.governance.outdatedNode.body')
                break
            case ProposalError.ResultsNotAvailable:
                title = localize('tooltips.governance.resultsNotAvailable.title')
                body = localize('tooltips.governance.resultsNotAvailable.body')
                break
        }

        return { title, body }
    }
</script>

<div bind:this={anchor} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
    <ProposalStatusPill {proposal} />
</div>
{#if isTooltipVisible}
    {#if proposal?.error}
        {@const { title, body } = getProposalErrorText(proposal)}
        {#if title && body}
            <InformationTooltip {anchor} {position} {title} {body} />
        {/if}
    {:else}
        <ProposalStatusTimelineTooltip bind:anchor slots={proposal.slots} status={proposal?.status} {position} />
    {/if}
{/if}
