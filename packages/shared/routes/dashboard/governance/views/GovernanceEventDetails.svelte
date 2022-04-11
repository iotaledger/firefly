<script lang="typescript">
    import { Button, DashboardPane, Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { canParticipate } from 'shared/lib/participation'
    import { participationOverview } from 'shared/lib/participation/stores'
    import { ParticipationEvent, ParticipationEventState, VotingEventAnswer } from 'shared/lib/participation/types'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { governanceRouter } from '@core/router'
    import { GovernanceRoute } from '@core/router/enums'
    import { handleTransactionEventData, selectedAccount, transferState } from 'shared/lib/wallet'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { milestoneToDate, getBestTimeDuration, getDurationString } from 'shared/lib/time'
    import { AccountColors } from 'shared/lib/wallet'
    import { calculateVotesByTrackedParticipation } from 'shared/lib/participation/governance'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { TransferProgressEventData, TransferProgressEventType, TransferState } from 'shared/lib/typings/events'
    import { formatUnitBestMatch } from 'shared/lib/units'

    export let event: ParticipationEvent
    export let account: WalletAccount

    let transactionEventData: TransferProgressEventData = null
    let currentVoteValue: string
    // TODO: base it on selectedAccountId when exposed in feat/single-wallet
    $: $selectedAccount, $participationOverview, updateCurrentVoteValue()

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
        $participationOverview?.find((acc) => acc?.accountIndex === account?.index)?.trackedParticipations?.[
            event?.eventId
        ]
    )

    $: results = event?.status?.questions?.[0]?.answers?.filter(
        (answer) => answer?.value !== 0 && answer?.value !== 255
    )

    $: totalVotes = results?.reduce((acc, val) => acc + val?.accumulated, 0)

    $: length =
        milestoneToDate(event?.information?.milestoneIndexEnd)?.getTime() -
        milestoneToDate(event?.information?.milestoneIndexStart)?.getTime()

    const handleBackClick = (): void => $governanceRouter.goTo(GovernanceRoute.Init)

    const handleClick = (nextVote: VotingEventAnswer): void => {
        const openGovernanceCastVotePopup = () =>
            openPopup({
                type: 'governanceCastVote',
                props: {
                    currentVoteValue,
                    eventId: event?.eventId,
                    nextVote,
                },
            })
        if ($isSoftwareProfile) {
            openGovernanceCastVotePopup()
        } else {
            promptUserToConnectLedger(false, () => openGovernanceCastVotePopup(), undefined, true)
        }
    }

    const getAnswerHeader = (castedAnswerValue: string, answerValue: string): string => {
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

    const getPercentageString = (dividend: number, divisor: number) => Math.round((dividend / divisor) * 100) + '%'

    const getProgressByMilestone = (milestone: number) => {
        const progress = milestoneToDate(milestone).getTime() - Date.now()
        return progress > 0 ? progress : 0
    }

    const setActiveText = (): string => {
        if (event?.status?.status === ParticipationEventState.Holding) {
            return localize('views.governance.eventDetails.answerHeader.activeVoting')
        }
        return localize('views.governance.eventDetails.answerHeader.selected')
    }

    const isSelected = (castedAnswerValue: string, answerValue: string): boolean => castedAnswerValue === answerValue

    const updateCurrentVoteValue = (): void => {
        const selectedAccountOverview = $participationOverview?.find(
            ({ accountIndex }) => accountIndex === $selectedAccount.index
        )
        const participation = selectedAccountOverview?.participations?.find(
            (participation) => participation.eventId === event.eventId
        )
        currentVoteValue = participation?.answers[0] ?? null
    }

    const handleTransferState = (state: TransferState): void => {
        if (!state) {
            return
        }

        const _onCancel = () => {
            transferState.set(null)
            closePopup(true)
        }

        const { data, type } = state

        switch (type) {
            case TransferProgressEventType.PerformingPoW:
                closePopup(true)
                break
            case TransferProgressEventType.SigningTransaction:
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

    $: $transferState, handleLedgerTransferState()
    const handleLedgerTransferState = () => {
        if (!$isSoftwareProfile) {
            handleTransferState($transferState)
        }
    }

    const isWinnerAnswer = (answerValue: string): boolean => {
        if (event?.status?.status === ParticipationEventState.Ended) {
            const resultsAccumulated = results.map((result) => result?.accumulated)
            const max = Math.max(...resultsAccumulated)
            const indexOfMax = resultsAccumulated.indexOf(max)
            return answerValue == results[indexOfMax]?.value.toString()
        }
        return false
    }
</script>

<div
    on:click={handleBackClick}
    class="inline-flex justify-between items-center w-20 p-2 pr-4 bg-white hover:bg-gray-100 border
    rounded-lg border-solid border-gray-300 cursor-pointer mb-5"
>
    <Icon icon="arrow-left" classes="w-4 h-4 text-gray-500" />
    <Text type="p" smaller overrideColor classes="text-gray-800">{localize('actions.back')}</Text>
</div>

<div class="w-full h-full grid grid-cols-3 gap-4 min-h-0" style="grid-template-rows: min-content 1fr">
    <DashboardPane classes="w-full h-full p-6 col-span-2 row-span-2 flex flex-col">
        <div class="flex flex-start items-center mb-2">
            <Text
                type="p"
                classes="px-2 py-1 text-blue-500 bg-blue-100 dark:bg-gray-900 rounded-lg"
                smaller
                bold
                overrideColor>{localize(`views.governance.events.status.${event?.status?.status}`)}</Text
            >
            <Icon icon="info-filled" classes="ml-2 text-gray-400" />
        </div>
        <Text type="h2" classes="mb-4">{event?.information?.name}</Text>
        <Text type="p" classes="mb-2" bold>{event?.information?.additionalInfo}</Text>
        <div class="min-h-0 overflow-auto mb-6">
            <Text type="p" classes="mb-1">{event?.information?.payload?.questions[0]?.text}</Text>
            <Text type="p">{event?.information?.payload?.questions[0]?.additionalInfo}</Text>
        </div>
        {#each event?.information?.payload?.questions[0]?.answers || [] as answer}
            <Button
                onClick={() => handleClick(answer)}
                secondary={!isWinnerAnswer(answer?.value)}
                disabled={!canParticipate(event?.status?.status)}
                active={isSelected(currentVoteValue, answer?.value)}
                classes="px-6 flex justify-between mb-4 overflow-hidden"
            >
                <div class="flex justify-between w-full items-center">
                    <div class="flex flex-col mr-32">
                        <div class="flex items-center mb-2">
                            {#if isSelected(currentVoteValue, answer?.value)}
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
                                classes="uppercase text-blue-500 {currentVoteValue &&
                                !isSelected(currentVoteValue, answer?.value)
                                    ? 'text-gray-500'
                                    : ''}
                                {isWinnerAnswer(answer?.value) ? 'text-white' : ''}"
                                overrideColor
                                smaller
                                bold
                            >
                                {getAnswerHeader(currentVoteValue, answer?.value)}
                            </Text>
                        </div>
                        <Text
                            type="h3"
                            classes="mb-2 text-left {isWinnerAnswer(answer?.value)
                                ? 'text-white'
                                : 'text-gray-800 dark:text-white'}"
                            overrideColor>{answer?.text}</Text
                        >
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
                <div>
                    <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-white" overrideColor
                        >{localize('views.governance.votingPower.title')}</Text
                    >
                    <Text type="h2" classes="inline-flex items-end">{account?.balance}</Text>
                </div>
                {#if event?.status?.status === ParticipationEventState.Upcoming}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-white" overrideColor
                            >{localize('views.governance.eventDetails.votingOpens')}</Text
                        >
                        <Text type="h3" classes="inline-flex items-end"
                            >{milestoneToDate(event?.information?.milestoneIndexCommence).toString()}</Text
                        >
                    </div>
                {/if}
                {#if event?.status?.status === ParticipationEventState.Upcoming || event?.status?.status === ParticipationEventState.Commencing}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-white" overrideColor
                            >{localize('views.governance.eventDetails.countingStarts')}</Text
                        >
                        <Text type="h3" classes="inline-flex items-end"
                            >{milestoneToDate(event?.information?.milestoneIndexStart).toString()}</Text
                        >
                    </div>
                {/if}
                {#if event?.status?.status === ParticipationEventState.Commencing}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-white" overrideColor
                            >{localize('views.governance.eventDetails.countingLength')}</Text
                        >
                        <Text type="h3" classes="inline-flex items-end">{getBestTimeDuration(length)}</Text>
                    </div>
                {/if}
                {#if event?.status?.status === ParticipationEventState.Holding || event?.status?.status === ParticipationEventState.Ended}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-white" overrideColor
                            >{localize('views.governance.eventDetails.votesCounted')}</Text
                        >
                        <Text type="h3" classes="inline-flex items-end">{formatUnitBestMatch(accountVotes)}</Text>
                    </div>
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700 dark:text-white" overrideColor
                            >{localize('views.governance.eventDetails.votingProgress')}</Text
                        >
                        <Text type="h3" classes="inline-flex items-end">{getDurationString(progress)}</Text>
                    </div>
                {/if}
            </div>
            <Icon icon="info-filled" classes="ml-auto mt-0 text-gray-400" />
        </DashboardPane>
    </div>
    {#if event?.status?.status === ParticipationEventState.Holding || event?.status?.status === ParticipationEventState.Ended}
        <DashboardPane classes="w-full h-full flex flex-col flex-shrink-0 overflow-hidden p-6">
            <Text type="p" smaller classes="mb-8 text-gray-700 dark:text-white" overrideColor
                >{localize('views.governance.eventDetails.currentResults')}</Text
            >
            <div class="w-full h-full flex justify-center space-x-16">
                {#each results || [] as result, i}
                    <div class="h-full flex flex-col justify-end items-center">
                        <div
                            class="w-12 rounded-t-lg"
                            style="height: {displayedPercentages[i]
                                ?.relativePercentage}; background-color: {Object.values(AccountColors)[i]};"
                        />
                        <div class="flex space-x-1 mt-3" style="max-width: 7rem">
                            <Text type="h3" classes="w-full whitespace-nowrap overflow-hidden"
                                >{event?.information?.payload?.questions[0]?.answers[i]?.text?.split(' ')[0]}</Text
                            >
                            <Text type="h3" overrideColor classes="text-gray-500"
                                >{displayedPercentages[i].percentage}</Text
                            >
                        </div>
                        <Text type="p" overrideColor bigger classes="text-gray-500 m-0"
                            >{formatUnitBestMatch(result?.accumulated)}</Text
                        >
                    </div>
                {/each}
            </div>
        </DashboardPane>
    {/if}
</div>

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
