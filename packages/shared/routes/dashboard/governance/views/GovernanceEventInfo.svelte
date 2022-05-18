<script lang="typescript">
    import { localize } from '@core/i18n'
    import { canParticipate, getAccountParticipationAbility } from '@lib/participation'
    import {
        currentAccountTreasuryVotePartiallyUnvotedAmount,
        currentAccountTreasuryVoteValue,
        hasCurrentAccountReceivedFundsSinceLastTreasuryVote,
    } from '@lib/participation/account'
    import {
        AccountParticipationAbility,
        ParticipationEvent,
        ParticipationEventState,
        VotingEventAnswer,
    } from '@lib/participation/types'
    import { openPopup } from '@lib/popup'
    import { formatUnitBestMatch } from '@lib/units'
    import { selectedAccountStore } from '@lib/wallet'
    import { Button, DashboardPane, GovernanceInfoTooltip, Icon, Text, Tooltip } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'

    export let event: ParticipationEvent
    export let nextVote: VotingEventAnswer = null

    $: cannotVote = getAccountParticipationAbility($selectedAccountStore) === AccountParticipationAbility.HasDustAmount

    const tooltip = {
        statusTimeline: { anchor: null as HTMLElement, show: false },
        partiallyVoted: { anchor: null as HTMLElement, show: false },
    }

    $: results = event?.status?.questions?.[0]?.answers?.filter(
        (answer) => answer?.value !== 0 && answer?.value !== 255
    )

    const isSelected = (castedAnswerValue: string, answerValue: string): boolean => castedAnswerValue === answerValue

    function handleAnswerClick(_nextVote: VotingEventAnswer): void {
        if (cannotVote) {
            showAppNotification({
                type: 'warning',
                message: localize('warning.participation.noFunds'),
            })

            return
        }
        nextVote = _nextVote
        openPopup({
            type: 'governanceManager',
            props: {
                eventId: event?.eventId,
                nextVote,
            },
        })
    }
    function getAnswerHeader(castedAnswerValue: string, answerValue: string): string {
        if (isWinnerAnswer(answerValue)) {
            return localize('views.governance.eventDetails.answerHeader.winner')
        } else if (isSelected(castedAnswerValue, answerValue)) {
            return setActiveText()
        } else if (castedAnswerValue) {
            return localize('views.governance.eventDetails.answerHeader.notSelected')
        } else {
            return `${localize('general.option')} ${answerValue}`
        }
    }
    function setActiveText(): string {
        if (event?.status?.status === ParticipationEventState.Holding) {
            return localize('views.governance.eventDetails.answerHeader.activeVoting')
        }
        return localize('views.governance.eventDetails.answerHeader.selected')
    }
    function isWinnerAnswer(answerValue: string): boolean {
        if (event?.status?.status === ParticipationEventState.Ended && results?.length) {
            const resultsAccumulated = results.map((result) => result?.accumulated)
            const max = Math.max(...resultsAccumulated)
            const indexOfMax = resultsAccumulated.indexOf(max)
            return answerValue == results[indexOfMax]?.value.toString()
        }
        return false
    }
    function toggleTooltip(type: string, show: boolean): void {
        switch (type) {
            case 'statusTimeline':
                tooltip.statusTimeline.show = show
                break
            case 'partiallyVoted':
                tooltip.partiallyVoted.show = show
                break
            default:
                break
        }
    }
</script>

<DashboardPane classes="w-full h-full p-6 col-span-2 row-span-2 flex flex-col">
    <div class="flex flex-start items-center mb-2">
        <Text
            type="p"
            classes="px-2 py-1 text-blue-500 bg-blue-100 dark:bg-gray-900 rounded-lg"
            smaller
            bold
            overrideColor
        >
            {localize(`views.governance.events.status.${event?.status?.status}`)}
        </Text>
        <button
            on:mouseenter={() => toggleTooltip('statusTimeline', true)}
            on:mouseleave={() => toggleTooltip('statusTimeline', false)}
            bind:this={tooltip.statusTimeline.anchor}
        >
            <Icon icon="info-filled" classes="ml-2 text-gray-400" />
        </button>
        {#if tooltip.statusTimeline.show}
            <GovernanceInfoTooltip
                {event}
                type="statusTimeline"
                anchor={tooltip.statusTimeline.anchor}
                position="right"
            />
        {/if}
    </div>
    <Text type="h2" classes="mb-4">{event?.information?.name}</Text>
    <Text type="p" overrideColor classes="mb-2 text-gray-700 dark:text-gray-500" bold
        >{event?.information?.additionalInfo}</Text
    >
    <div class="min-h-0 overflow-auto mb-6">
        <Text type="p" overrideColor classes="mb-1 text-gray-700 dark:text-gray-500"
            >{event?.information?.payload?.questions[0]?.text}</Text
        >
        <Text type="p" overrideColor classes="text-gray-700 dark:text-gray-500"
            >{event?.information?.payload?.questions[0]?.additionalInfo}</Text
        >
    </div>
    {#each event?.information?.payload?.questions[0]?.answers || [] as answer}
        <Button
            onClick={() => handleAnswerClick(answer)}
            secondary={!isWinnerAnswer(answer?.value)}
            disabled={!canParticipate(event?.status?.status)}
            active={isSelected($currentAccountTreasuryVoteValue, answer?.value)}
            classes="relative px-6 flex justify-between mb-4 overflow-hidden {isSelected(
                $currentAccountTreasuryVoteValue,
                answer?.value
            ) && $hasCurrentAccountReceivedFundsSinceLastTreasuryVote
                ? 'caution-border'
                : ''}"
        >
            <div class="flex justify-between w-full items-center">
                <div class="flex flex-col mr-32">
                    <div class="flex items-center mb-2">
                        {#if isSelected($currentAccountTreasuryVoteValue, answer?.value)}
                            {#if event?.status?.status === ParticipationEventState.Holding}
                                <span class="relative flex justify-center items-center h-3 w-3 mr-2">
                                    <span
                                        class="pulse absolute inline-flex h-full w-full rounded-full bg-blue-400
                                        opacity-75"
                                    />
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                                </span>
                            {:else}
                                <Icon
                                    width="16"
                                    height="16"
                                    icon="checkbox-round"
                                    classes="{isWinnerAnswer(answer?.value) ? 'text-black' : 'text-blue-500'} mr-2"
                                    inlineStyle={isWinnerAnswer(answer?.value) ? 'filter: invert(1)' : ''}
                                />
                            {/if}
                        {/if}
                        <Text
                            type="p"
                            classes="uppercase text-blue-500 {$currentAccountTreasuryVoteValue &&
                            !isSelected($currentAccountTreasuryVoteValue, answer?.value)
                                ? 'text-gray-500'
                                : ''}
                            {isWinnerAnswer(answer?.value) ? 'text-white' : ''}"
                            overrideColor
                            smaller
                            bold
                        >
                            {getAnswerHeader($currentAccountTreasuryVoteValue, answer?.value)}
                        </Text>
                    </div>
                    {#if isSelected($currentAccountTreasuryVoteValue, answer?.value) && $hasCurrentAccountReceivedFundsSinceLastTreasuryVote}
                        <div
                            bind:this={tooltip.partiallyVoted.anchor}
                            on:mouseenter={() => toggleTooltip('partiallyVoted', true)}
                            on:mouseleave={() => toggleTooltip('partiallyVoted', false)}
                            class="absolute top-2 right-2"
                        >
                            <Icon
                                icon="exclamation"
                                width="17"
                                height="17"
                                classes="fill-current text-yellow-600 group-hover:text-gray-900"
                            />
                        </div>
                        {#if tooltip.partiallyVoted.show}
                            <Tooltip anchor={tooltip.partiallyVoted.anchor} position="right">
                                <Text type="p" classes="text-gray-900 bold mb-1 text-left">
                                    {localize('views.governance.info.tooltip.partiallyVoted.title', {
                                        values: {
                                            amount: formatUnitBestMatch(
                                                $currentAccountTreasuryVotePartiallyUnvotedAmount
                                            ),
                                        },
                                    })}
                                </Text>
                                <Text type="p" secondary classes="text-left">
                                    {localize('views.governance.info.tooltip.partiallyVoted.body', {
                                        values: { account: $selectedAccountStore?.alias },
                                    })}
                                </Text>
                            </Tooltip>
                        {/if}
                    {/if}
                    <Text
                        type="h3"
                        classes="mb-2 text-left {isWinnerAnswer(answer?.value)
                            ? 'text-white'
                            : 'text-gray-800 dark:text-white'}"
                        overrideColor
                    >
                        {answer?.text}
                    </Text>
                    <Text
                        type="p"
                        classes="text-left max-h-32 overflow-auto {isWinnerAnswer(answer?.value)
                            ? 'text-white dark:text-white'
                            : 'text-gray-700 dark:text-gray-500'}"
                        overrideColor
                    >
                        {answer?.additionalInfo}
                    </Text>
                </div>
                {#if canParticipate(event?.status?.status)}
                    {#if isSelected($currentAccountTreasuryVoteValue, answer?.value) && $hasCurrentAccountReceivedFundsSinceLastTreasuryVote}
                        <div class="px-4 py-2 border-2 border-solid border-yellow-600 rounded-lg">
                            <Text type="p">{localize('views.governance.manageVote')}</Text>
                        </div>
                    {:else}
                        <div>
                            <Icon icon="chevron-right" />
                        </div>
                    {/if}
                {/if}
            </div>
        </Button>
    {/each}
</DashboardPane>

<style type="text/scss">
    .pulse {
        animation: -ping 2500ms cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    @keyframes -ping {
        30%,
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }
</style>
