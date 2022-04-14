<script lang="typescript">
    import { Tooltip, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { SECONDS_PER_MILESTONE, SECONDS_PER_MINUTE, milestoneToDate } from '@lib/time'
    import { formatUnitBestMatch } from '@lib/units'
    import { ParticipationEvent } from '@lib/participation'
    import { selectedAccountParticipationOverview } from '@lib/participation/account'

    export let event: ParticipationEvent
    export let type: GovernanceInfoType
    export let anchor: HTMLElement
    export let position: string

    enum GovernanceInfoType {
        StatusTimeline = 'statusTimeline',
        VotingRate = 'votingRate',
        CountedVotes = 'countedVotes',
    }

    $: trackedParticipation = $selectedAccountParticipationOverview?.trackedParticipations?.[event?.eventId]
    $: lastTrackedParticipationItem = trackedParticipation?.[trackedParticipation.length - 1]
    $: votesPerMinute = lastTrackedParticipationItem?.amount * 0.001 * (SECONDS_PER_MINUTE / SECONDS_PER_MILESTONE)
</script>

<Tooltip {anchor} {position}>
    {#if type === GovernanceInfoType.StatusTimeline}
        <ul>
            <li>
                <Text>{localize('views.governance.info.tooltip.eventStatusTimeline.announcement')}</Text>
            </li>
            <li>
                <Text>{milestoneToDate(event?.information?.milestoneIndexCommence)}</Text>
                <Text>{localize('views.governance.info.tooltip.eventStatusTimeline.votingOpen')}</Text>
            </li>
            <li>
                <Text>{milestoneToDate(event?.information?.milestoneIndexStart)}</Text>
                <Text>{localize('views.governance.info.tooltip.eventStatusTimeline.countingStarts')}</Text>
            </li>
            <li>
                <Text>{milestoneToDate(event?.information?.milestoneIndexEnd)}</Text>
                <Text>{localize('views.governance.info.tooltip.eventStatusTimeline.countingStops')}</Text>
            </li>
        </ul>
    {:else if type === GovernanceInfoType.VotingRate}
        <Text type="h3">{localize('views.governance.info.tooltip.votingRate.title')}</Text>
        <Text>
            {localize('views.governance.info.tooltip.votingRate.body', {
                amount: formatUnitBestMatch(lastTrackedParticipationItem?.amount),
                votesPerMinute,
            })}
        </Text>
    {:else if type === GovernanceInfoType.CountedVotes}
        <Text type="h3">{localize('views.governance.info.tooltip.countedVotes.title')}</Text>
        <Text>{localize('views.governance.info.tooltip.countedVotes.body')}</Text>
    {/if}
</Tooltip>
