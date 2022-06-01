<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { formatNumber } from '@lib/currency'
    import { ParticipationEvent, ParticipationEventState } from '@lib/participation'
    import { milestoneToDate, SECONDS_PER_MILESTONE, SECONDS_PER_MINUTE } from '@lib/time'
    import { formatUnitBestMatch } from '@lib/units'
    import { selectedAccountStore } from '@lib/wallet'
    import { Text, Tooltip } from 'shared/components'

    export let event: ParticipationEvent
    export let type: GovernanceInfoType
    export let anchor: HTMLElement
    export let position: string

    enum GovernanceInfoType {
        StatusTimeline = 'statusTimeline',
        VotingRate = 'votingRate',
        CountedVotes = 'countedVotes',
        MaximumVotes = 'maximumVotes',
        VotingWeight = 'votingWeight',
    }

    const dateFormat = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    } as Intl.DateTimeFormatOptions

    let eventProgress: number
    switch (event?.status?.status) {
        case ParticipationEventState.Inactive:
            eventProgress = 0
            break
        case ParticipationEventState.Upcoming:
            eventProgress = 1
            break
        case ParticipationEventState.Commencing:
            eventProgress = 2
            break
        case ParticipationEventState.Holding:
            eventProgress = 3
            break
        case ParticipationEventState.Ended:
            eventProgress = 4
            break
        default:
            break
    }

    $: votesPerMilestone = formatNumber($selectedAccountStore?.rawIotaBalance / 1000 || 0, 0, 0, 2, true)
</script>

<Tooltip {anchor} {position}>
    {#if type === GovernanceInfoType.StatusTimeline}
        <ul class="space-y-3 text-left">
            <li class="grid grid-rows-2 relative" class:active={eventProgress > 1}>
                <Text
                    overrideColor={eventProgress <= 1}
                    classes={eventProgress <= 1 ? 'text-gray-400 dark:text-gray-700' : ''}
                >
                    {formatDate(milestoneToDate(event?.information?.milestoneIndexCommence), dateFormat)}
                </Text>
                <Text
                    type="h5"
                    overrideColor={eventProgress <= 1}
                    classes={eventProgress <= 1 ? 'text-gray-400 dark:text-gray-700' : ''}
                >
                    {localize(
                        `views.governance.info.tooltip.eventStatusTimeline.${
                            eventProgress <= 1 ? 'votingOpen' : 'votingOpened'
                        }`
                    )}
                </Text>
            </li>
            <li class="grid grid-rows-2 relative" class:active={eventProgress > 2}>
                <Text
                    overrideColor={eventProgress <= 2}
                    classes={eventProgress <= 2 ? 'text-gray-400 dark:text-gray-700' : ''}
                >
                    {formatDate(milestoneToDate(event?.information?.milestoneIndexStart), dateFormat)}
                </Text>
                <Text
                    type="h5"
                    overrideColor={eventProgress <= 2}
                    classes={eventProgress <= 2 ? 'text-gray-400 dark:text-gray-700' : ''}
                >
                    {localize(
                        `views.governance.info.tooltip.eventStatusTimeline.${
                            eventProgress <= 2 ? 'countingStarts' : 'countingStarted'
                        }`
                    )}
                </Text>
            </li>
            <li class="grid grid-rows-2 relative" class:active={eventProgress > 3}>
                <Text
                    overrideColor={eventProgress <= 3}
                    classes={eventProgress <= 3 ? 'text-gray-400 dark:text-gray-700' : ''}
                >
                    {formatDate(milestoneToDate(event?.information?.milestoneIndexEnd), dateFormat)}
                </Text>
                <Text
                    type="h5"
                    overrideColor={eventProgress <= 3}
                    classes={eventProgress <= 3 ? 'text-gray-400 dark:text-gray-700' : ''}
                >
                    {localize(
                        `views.governance.info.tooltip.eventStatusTimeline.${
                            eventProgress <= 3 ? 'countingStops' : 'countingStopped'
                        }`
                    )}
                </Text>
            </li>
        </ul>
    {:else if type === GovernanceInfoType.VotingRate}
        <Text type="h3" classes="text-left">{localize('views.governance.info.tooltip.votingRate.title')}</Text>
        <Text classes="text-left">
            {localize('views.governance.info.tooltip.votingRate.body', {
                values: {
                    amount: formatUnitBestMatch($selectedAccountStore?.rawIotaBalance, true, 3),
                    votesPerMilestone,
                    time: SECONDS_PER_MILESTONE.toString(),
                },
            })}
        </Text>
    {:else if type === GovernanceInfoType.CountedVotes}
        <Text type="h3" classes="text-left">{localize('views.governance.info.tooltip.countedVotes.title')}</Text>
        <Text classes="text-left"
            >{localize('views.governance.info.tooltip.countedVotes.body', {
                values: {
                    amount: formatUnitBestMatch($selectedAccountStore?.rawIotaBalance, true, 3),
                    votesPerMilestone,
                    time: SECONDS_PER_MILESTONE.toString(),
                },
            })}</Text
        >
    {:else if type === GovernanceInfoType.MaximumVotes}
        <Text type="h3" classes="text-left">{localize('views.governance.info.tooltip.maximumVotes.title')}</Text>
        <Text classes="text-left">{localize('views.governance.info.tooltip.maximumVotes.body')}</Text>
    {/if}
    {#if type === GovernanceInfoType.VotingWeight}
        <div>
            <Text type="h3" classes="text-left">{localize('views.governance.votingPower.info.title')}</Text>
            <Text type="p" classes="mb-2 text-left">{localize('views.governance.votingPower.info.description1')}</Text>
            <Text type="p" classes="text-left">{localize('views.governance.votingPower.info.description2')}</Text>
        </div>
    {/if}
</Tooltip>

<style lang="scss">
    li {
        grid-template-columns: min-content 1fr;
        &::before {
            @apply justify-self-start;
            @apply mr-4;
            @apply row-span-2;
            @apply self-center;
            @apply text-2xl;
            @apply text-gray-400;
            content: '●';
        }
        &.active::before {
            @apply text-blue-400;
        }
        &:not(:first-child)::after {
            @apply absolute;
            @apply block;
            @apply border;
            @apply border-gray-300;
            @apply border-solid;
            @apply bottom-4;
            content: '';
            height: 130%;
            left: 0.38em;
            z-index: -1;
        }
    }
</style>
