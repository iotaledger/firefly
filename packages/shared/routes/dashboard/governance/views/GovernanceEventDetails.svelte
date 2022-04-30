<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { formatNumber } from '@lib/currency'
    import { canParticipate } from '@lib/participation'
    import { currentAccountTreasuryVoteValue, selectedAccountParticipationOverview } from '@lib/participation/account'
    import { calculateVotesByMilestones, calculateVotesByTrackedParticipation } from '@lib/participation/governance'
    import { ParticipationEvent, ParticipationEventState, VotingEventAnswer } from '@lib/participation/types'
    import { closePopup, openPopup } from '@lib/popup'
    import { isSoftwareProfile } from '@lib/profile'
    import { getDurationString, milestoneToDate } from '@lib/time'
    import { TransferProgressEventData, TransferProgressEventType, TransferState } from '@lib/typings/events'
    import { WalletAccount } from '@lib/typings/wallet'
    import { AccountColors, handleTransactionEventData, selectedAccount, transferState } from '@lib/wallet'
    import { Button, DashboardPane, GovernanceInfoTooltip, Icon, Text } from 'shared/components'
    import { participationAction } from 'shared/lib/participation/stores'
    import { popupState } from 'shared/lib/popup'

    export let event: ParticipationEvent
    export let account: WalletAccount

    let transactionEventData: TransferProgressEventData = null
    let nextVote: VotingEventAnswer = null
    let ledgerAwaitingConfirmation = false

    const dateFormat = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    } as Intl.DateTimeFormatOptions

    $: progress = getProgressByMilestone(event?.information?.milestoneIndexEnd)
    $: displayedPercentages = results?.map((result) => {
        const percentage = getPercentageString(result?.accumulated, totalVotes)
        const relativePercentage = getPercentageString(
            result?.accumulated,
            Math.max(...results.map((result) => result?.accumulated))
        )
        return { percentage, relativePercentage }
    })
    $: accountVotes = calculateVotesByTrackedParticipation(
        $selectedAccountParticipationOverview?.trackedParticipations?.[event?.eventId]
    )
    $: results = event?.status?.questions?.[0]?.answers?.filter(
        (answer) => answer?.value !== 0 && answer?.value !== 255
    )
    $: totalVotes = results?.reduce((acc, val) => acc + val?.accumulated, 0)

    $: $transferState, handleLedgerTransferState()
    $: if (!$participationAction && ledgerAwaitingConfirmation && $popupState.type === 'ledgerTransaction') {
        closePopup(true)
    }

    const getPercentageString = (dividend: number, divisor: number) =>
        (Math.round((dividend / divisor) * 100) || 0) + '%'
    const isSelected = (castedAnswerValue: string, answerValue: string): boolean => castedAnswerValue === answerValue
    const handleLedgerTransferState = (): void => !$isSoftwareProfile && handleTransferState($transferState)
    const tooltip = {
        statusTimeline: { anchor: null as HTMLElement, show: false },
        votingRate: { anchor: null as HTMLElement, show: false },
        countedVotes: { anchor: null as HTMLElement, show: false },
        maximumVotes: { anchor: null as HTMLElement, show: false },
    }

    function handleAnswerClick(_nextVote: VotingEventAnswer): void {
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
    function getProgressByMilestone(milestone: number) {
        const progress = milestoneToDate(milestone).getTime() - Date.now()
        return progress > 0 ? progress : 0
    }
    function setActiveText(): string {
        if (event?.status?.status === ParticipationEventState.Holding) {
            return localize('views.governance.eventDetails.answerHeader.activeVoting')
        }
        return localize('views.governance.eventDetails.answerHeader.selected')
    }
    function handleTransferState(state: TransferState): void {
        if (!state) {
            return
        }

        const _onCancel = () => {
            transferState.set(null)
            closePopup(true)
        }

        const { data, type } = state

        switch (type) {
            // If a user presses "Accept" on ledger, this is the next transfer progress item.
            case TransferProgressEventType.PerformingPoW:
                // Close the current pop up i.e., the one with ledger transaction details
                closePopup(true)
                // Re-open the staking manager pop up
                openPopup(
                    {
                        type: 'governanceManager',
                        props: {
                            eventId: event?.eventId,
                            nextVote,
                        },
                    },
                    true
                )
                break
            case TransferProgressEventType.SigningTransaction:
                ledgerAwaitingConfirmation = true
                openPopup(
                    {
                        type: 'ledgerTransaction',
                        hideClose: true,
                        preventClose: true,
                        props: {
                            ...handleTransactionEventData(transactionEventData),
                            onCancel: _onCancel,
                        },
                    },
                    true
                )
                break
            case TransferProgressEventType.PreparedTransaction:
                transactionEventData = data
                break
            default:
                break
        }
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

    $: trackedParticipation = $selectedAccountParticipationOverview?.trackedParticipations?.[event?.eventId]
    $: lastTrackedParticipationItem = trackedParticipation?.[trackedParticipation.length - 1]
    $: maximumVotes = calculateVotesByMilestones(
        event?.information?.milestoneIndexStart,
        event?.information?.milestoneIndexEnd,
        lastTrackedParticipationItem?.amount
    )
</script>

<div class="w-full h-full grid grid-cols-3 gap-4 min-h-0" style="grid-template-rows: min-content 1fr">
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
        </div>
        <Text type="h2" classes="mb-4">{event?.information?.name}</Text>
        <Text type="p" classes="mb-2" bold>{event?.information?.additionalInfo}</Text>
        <div class="min-h-0 overflow-auto mb-6">
            <Text type="p" classes="mb-1">{event?.information?.payload?.questions[0]?.text}</Text>
            <Text type="p">{event?.information?.payload?.questions[0]?.additionalInfo}</Text>
        </div>
        {#each event?.information?.payload?.questions[0]?.answers || [] as answer}
            <Button
                onClick={() => handleAnswerClick(answer)}
                secondary={!isWinnerAnswer(answer?.value)}
                disabled={!canParticipate(event?.status?.status)}
                active={isSelected($currentAccountTreasuryVoteValue, answer?.value)}
                classes="px-6 flex justify-between mb-4 overflow-hidden"
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
                                ? 'text-white'
                                : 'text-gray-800 dark:text-white'}"
                            overrideColor
                        >
                            {answer?.additionalInfo}
                        </Text>
                    </div>
                    {#if canParticipate(event?.status?.status)}
                        <div>
                            <Icon icon="chevron-right" />
                        </div>
                    {/if}
                </div>
            </Button>
        {/each}
    </DashboardPane>
    <div>
        <DashboardPane classes="w-full h-full flex flex-row flex-shrink-0 overflow-hidden p-6">
            <div class="space-y-5">
                {#if accountVotes <= 0 && event?.status?.status !== ParticipationEventState.Ended}
                    <div class="flex flex-col flex-wrap space-y-3">
                        <div class="flex flex-row items-center space-x-2">
                            <Text type="p" smaller classes="text-gray-700 dark:text-gray-500" overrideColor>
                                {localize('views.governance.votingPower.info.title')}
                            </Text>
                            {#if $selectedAccount?.rawIotaBalance > 0}
                                <button
                                    class="relative"
                                    on:mouseenter={() => toggleTooltip('votingRate', true)}
                                    on:mouseleave={() => toggleTooltip('votingRate', false)}
                                    bind:this={tooltip.votingRate.anchor}
                                >
                                    <Icon icon="info-filled" classes="text-gray-400" />
                                </button>
                            {/if}
                        </div>
                        <Text type="h2">{account?.balance}</Text>
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
                        <div class="flex flex-row items-center space-x-2">
                            <Text type="p" smaller classes="text-gray-700 dark:text-gray-500" overrideColor>
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
                            {/if}
                        </div>
                        <Text type="h3" classes="inline-flex items-end"
                            >{formatNumber(accountVotes, 0, 0, 2, true)}</Text
                        >
                    </div>
                {/if}
                {#if event?.status?.status === ParticipationEventState.Holding && accountVotes > 0}
                    <div class="flex flex-col flex-wrap space-y-3">
                        <div class="flex flex-row items-center space-x-2">
                            <Text type="p" smaller classes="text-gray-700 dark:text-gray-500" overrideColor>
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
                        </div>
                        <Text type="h3" classes="inline-flex items-end"
                            >{formatNumber(maximumVotes, 0, 0, 2, true)}</Text
                        >
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
    </div>
    {#if event?.status?.status === ParticipationEventState.Holding || event?.status?.status === ParticipationEventState.Ended}
        <DashboardPane classes="w-full h-full flex flex-col flex-shrink-0 overflow-hidden p-6">
            <Text type="p" smaller classes="mb-8 text-gray-700 dark:text-gray-500" overrideColor>
                {localize(
                    `views.governance.eventDetails.${
                        event?.status?.status === ParticipationEventState.Ended ? 'finalResult' : 'currentResult'
                    }`
                )}
            </Text>
            <div class="w-full h-full flex justify-center space-x-8">
                {#each results || [] as result, i}
                    <div class="h-full flex flex-col justify-end items-center">
                        <div
                            class="w-12 rounded-t-lg"
                            style="height: {displayedPercentages[i]
                                ?.relativePercentage}; background-color: {Object.values(AccountColors)[i]};"
                        />
                        <div class="flex space-x-1 mt-3" style="max-width: 7rem">
                            <Text type="h3" classes="w-full whitespace-nowrap overflow-hidden">
                                {event?.information?.payload?.questions[0]?.answers[i]?.text?.split(' ')[0]}
                            </Text>
                            <Text type="h3" overrideColor classes="text-gray-500">
                                {displayedPercentages[i].percentage}
                            </Text>
                        </div>
                        <Text type="p" overrideColor bigger classes="text-gray-500 m-0 max-w-36 break-all">
                            {formatNumber(result?.accumulated, 0, 0, 2, true)}
                        </Text>
                    </div>
                {/each}
            </div>
        </DashboardPane>
    {/if}
</div>

{#if tooltip.votingRate.show}
    <GovernanceInfoTooltip {event} type="votingRate" anchor={tooltip.votingRate.anchor} position="bottom" />
{/if}
{#if tooltip.countedVotes.show}
    <GovernanceInfoTooltip {event} type="countedVotes" anchor={tooltip.countedVotes.anchor} position="bottom" />
{/if}
{#if tooltip.maximumVotes.show}
    <GovernanceInfoTooltip {event} type="maximumVotes" anchor={tooltip.maximumVotes.anchor} position="bottom" />
{/if}
{#if tooltip.statusTimeline.show}
    <GovernanceInfoTooltip {event} type="statusTimeline" anchor={tooltip.statusTimeline.anchor} position="right" />
{/if}

<style>
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
