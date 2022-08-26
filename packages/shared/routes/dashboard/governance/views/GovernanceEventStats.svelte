<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { formatNumber } from '@lib/currency'
    import { currentTreasuryParticipation, selectedAccountParticipationOverview } from '@lib/participation/account'
    import { calculateVotesByMilestones, calculateVotesByTrackedParticipation } from '@lib/participation/governance'
    import { ParticipationEvent, ParticipationEventState } from '@lib/participation/types'
    import { getDurationString, milestoneToDate } from '@lib/time'
    import { selectedAccountStore } from '@lib/wallet'
    import { DashboardPane, GovernanceInfoTooltip, Icon, Text } from 'shared/components'

    export let event: ParticipationEvent

    const dateFormat = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    } as Intl.DateTimeFormatOptions

    const tooltip = {
        votingRate: { anchor: null as HTMLElement, show: false },
        countedVotes: { anchor: null as HTMLElement, show: false },
        maximumVotes: { anchor: null as HTMLElement, show: false },
    }

    $: progress = getProgressByMilestone(event?.information?.milestoneIndexEnd)
    $: accountVotes = calculateVotesByTrackedParticipation(
        $selectedAccountParticipationOverview?.trackedParticipations?.[event?.eventId],
        event?.information?.milestoneIndexStart,
        event?.information?.milestoneIndexEnd
    )
    $: maximumVotes =
        calculateVotesByTrackedParticipation(
            $selectedAccountParticipationOverview?.trackedParticipations?.[event?.eventId]?.filter(
                (item) => item.messageId !== $currentTreasuryParticipation?.messageId
            ),
            event?.information?.milestoneIndexStart,
            event?.information?.milestoneIndexEnd
        ) +
        calculateVotesByMilestones(
            Math.max(event?.information?.milestoneIndexStart, $currentTreasuryParticipation?.startMilestoneIndex),
            event?.information?.milestoneIndexEnd,
            $currentTreasuryParticipation?.amount
        )

    function getProgressByMilestone(milestone: number) {
        const progress = milestoneToDate(milestone).getTime() - Date.now()
        return progress > 0 ? progress : 0
    }
    function toggleTooltip(type: string, show: boolean): void {
        switch (type) {
            case 'votingRate':
                tooltip.votingRate.show = show
                break
            case 'countedVotes':
                tooltip.countedVotes.show = show
                break
            case 'maximumVotes':
                tooltip.maximumVotes.show = show
                break
            default:
                break
        }
    }
</script>

<DashboardPane classes="w-full h-full flex flex-row flex-shrink-0 overflow-hidden p-6">
    <div class="space-y-5">
        {#if accountVotes <= 0 && event?.status?.status !== ParticipationEventState.Ended}
            <div class="flex flex-col flex-wrap space-y-3">
                <div class="flex flex-row items-center">
                    <Text type="p" smaller classes="text-gray-700 dark:text-gray-500 mr-2" overrideColor>
                        {localize('views.governance.votingPower.info.title')}
                    </Text>
                    {#if $selectedAccountStore?.rawIotaBalance > 0}
                        <button
                            class="relative"
                            on:mouseenter={() => toggleTooltip('votingRate', true)}
                            on:mouseleave={() => toggleTooltip('votingRate', false)}
                            bind:this={tooltip.votingRate.anchor}
                        >
                            <Icon icon="info-filled" classes="text-gray-400" />
                        </button>
                        {#if tooltip.votingRate.show}
                            <GovernanceInfoTooltip
                                {event}
                                type="votingRate"
                                anchor={tooltip.votingRate.anchor}
                                position="bottom"
                            />
                        {/if}
                    {/if}
                </div>
                <Text type="h2">{$selectedAccountStore?.balance}</Text>
            </div>
        {/if}
        {#if event?.status?.status === ParticipationEventState.Upcoming}
            <div>
                <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-gray-500" overrideColor>
                    {localize('views.governance.eventDetails.votingOpens')}
                </Text>
                <Text type="h3" classes="inline-flex items-end">
                    {formatDate(milestoneToDate(event?.information?.milestoneIndexCommence), dateFormat)}
                </Text>
            </div>
        {/if}
        {#if event?.status?.status === ParticipationEventState.Upcoming || event?.status?.status === ParticipationEventState.Commencing}
            <div>
                <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-gray-500" overrideColor>
                    {localize('views.governance.eventDetails.countingStarts')}
                </Text>
                <Text type="h3" classes="inline-flex items-end">
                    {formatDate(milestoneToDate(event?.information?.milestoneIndexStart), dateFormat)}
                </Text>
            </div>
        {/if}
        {#if (event?.status?.status === ParticipationEventState.Holding && accountVotes > 0) || event?.status?.status === ParticipationEventState.Ended}
            <div class="flex flex-col flex-wrap space-y-3">
                <div class="flex flex-row items-center">
                    <Text type="p" smaller classes="text-gray-700 dark:text-gray-500 mr-2" overrideColor>
                        {localize('views.governance.eventDetails.votesCounted')}
                    </Text>
                    {#if event?.status?.status === ParticipationEventState.Holding}
                        <button
                            class="relative"
                            on:mouseenter={() => toggleTooltip('countedVotes', true)}
                            on:mouseleave={() => toggleTooltip('countedVotes', false)}
                            bind:this={tooltip.countedVotes.anchor}
                        >
                            <Icon icon="info-filled" classes="text-gray-400" />
                        </button>
                        {#if tooltip.countedVotes.show}
                            <GovernanceInfoTooltip
                                {event}
                                type="countedVotes"
                                anchor={tooltip.countedVotes.anchor}
                                position="bottom"
                            />
                        {/if}
                    {/if}
                </div>
                <Text type="h3" classes="inline-flex items-end">
                    {formatNumber(accountVotes, 0, 0, 2, true)}
                </Text>
            </div>
        {/if}
        {#if event?.status?.status === ParticipationEventState.Holding && $currentTreasuryParticipation}
            <div class="flex flex-col flex-wrap space-y-3">
                <div class="flex flex-row items-center">
                    <Text type="p" smaller classes="text-gray-700 dark:text-gray-500 mr-2" overrideColor>
                        {localize('views.governance.eventDetails.maximumVotes')}
                    </Text>
                    <button
                        class="relative"
                        on:mouseenter={() => toggleTooltip('maximumVotes', true)}
                        on:mouseleave={() => toggleTooltip('maximumVotes', false)}
                        bind:this={tooltip.maximumVotes.anchor}
                    >
                        <Icon icon="info-filled" classes="text-gray-400" />
                    </button>
                    {#if tooltip.maximumVotes.show}
                        <GovernanceInfoTooltip
                            {event}
                            type="maximumVotes"
                            anchor={tooltip.maximumVotes.anchor}
                            position="bottom"
                        />
                    {/if}
                </div>
                <Text type="h3" classes="inline-flex items-end">
                    {formatNumber(maximumVotes, 0, 0, 2, true)}
                </Text>
            </div>
        {/if}
        {#if event?.status?.status === ParticipationEventState.Holding || event?.status?.status === ParticipationEventState.Ended}
            <div>
                <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-gray-500" overrideColor>
                    {localize('views.governance.eventDetails.votingProgress')}
                </Text>
                <Text type="h3" classes="inline-flex items-end">{getDurationString(progress)}</Text>
            </div>
        {/if}
    </div>
</DashboardPane>
