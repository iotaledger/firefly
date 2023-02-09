<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { VotingEventPayload, ParticipationEventType, TrackedParticipationOverview } from '@iota/wallet/out/types'
    import { localize } from '@core/i18n'
    import {
        Button,
        FontWeight,
        KeyValueBox,
        Pane,
        ProposalDetailsButton,
        ProposalInformation,
        ProposalQuestion,
        ProposalStatusPill,
        Text,
        TextType,
        TextHint,
    } from '@ui'
    import { openPopup } from '@auxiliary/popup/actions'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { getVotingEvent } from '@contexts/governance/actions'
    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import { ProposalStatus } from '@contexts/governance/enums'
    import {
        hasPendingGovernanceTransaction,
        selectedProposal,
        updateParticipationOverview,
        participationOverviewForSelectedAccount,
        selectedParticipationEventStatus,
        clearSelectedParticipationEventStatus,
    } from '@contexts/governance/stores'
    import {
        calculateTotalVotesForTrackedParticipations,
        getActiveParticipation,
        isProposalVotable,
        isVotingForSelectedProposal,
    } from '@contexts/governance/utils'
    import { getBestTimeDuration, milestoneToDate } from '@core/utils'
    import { networkStatus } from '@core/network/stores'
    import { formatTokenAmountBestMatch } from '@core/wallet/utils'
    import { visibleSelectedAccountAssets } from '@core/wallet/stores'
    import { handleError } from '@core/error/handlers'
    import {
        clearParticipationEventStatusPoll,
        pollParticipationEventStatus,
    } from '@contexts/governance/actions/pollParticipationEventStatus'

    const { metadata } = $visibleSelectedAccountAssets?.baseCoin

    let selectedAnswerValues: number[] = []
    let votedAnswerValues: number[] = []
    let votingPayload: VotingEventPayload
    let totalVotes = 0
    let hasMounted = false
    let textHintString = ''
    let proposalQuestions: HTMLElement
    let isVotingForProposal: boolean = false

    // $: $selectedAccountIndex, void updateParticipationOverview()
    // $: $selectedAccountIndex, (selectedAnswerValues = [])

    $: selectedProposalOverview = $participationOverviewForSelectedAccount?.participations?.[$selectedProposal?.id]
    $: trackedParticipations = Object.values(selectedProposalOverview ?? {})
    $: currentMilestone = $networkStatus.currentMilestone

    // Reactively start updating votes once component has mounted and participation overview is available.
    $: hasMounted &&
        $selectedParticipationEventStatus &&
        trackedParticipations &&
        currentMilestone &&
        setVotedAnswerValuesAndTotalVotes()
    $: hasMounted && selectedProposalOverview && updateIsVoting()

    $: votesCounter = {
        total: totalVotes,
        power: parseInt($selectedAccount?.votingPower),
    }
    $: questions = votingPayload?.questions

    $: if (questions?.length > 0 && selectedAnswerValues?.length === 0) {
        selectedAnswerValues = [
            ...(getActiveParticipation($selectedProposal?.id)?.answers ?? Array.from({ length: questions?.length })),
        ]
    }

    $: isVotingDisabled =
        !isProposalVotable($selectedParticipationEventStatus?.status) ||
        !hasChangedAnswers(selectedAnswerValues) ||
        hasSelectedNoAnswers(selectedAnswerValues)
    $: isTransferring = $hasPendingGovernanceTransaction?.[$selectedAccountIndex]
    $: $selectedParticipationEventStatus, (textHintString = getTextHintString())

    function hasSelectedNoAnswers(_selectedAnswerValues: number[]): boolean {
        return (
            _selectedAnswerValues.length === 0 ||
            _selectedAnswerValues.every((answerValue) => answerValue === undefined)
        )
    }

    function hasChangedAnswers(_selectedAnswerValues: number[]): boolean {
        const activeParticipationAnswerValues = getActiveParticipation($selectedProposal?.id)?.answers
        if (activeParticipationAnswerValues) {
            /**
             * NOTE: If any of the values between what's active and selected differ, it means
             * that the user has changed at least one answer.
             */
            return _selectedAnswerValues.some(
                (selectedAnswerValue, idx) => selectedAnswerValue !== activeParticipationAnswerValues[idx]
            )
        } else {
            /**
             * NOTE: If the user hasn't voted for the participation yet, the user has not changed (all) answers
             * yet until every value is not undefined.
             */
            return _selectedAnswerValues.some((selectedAnswerValue) => selectedAnswerValue !== undefined)
        }
    }

    async function setVotingEventPayload(eventId: string): Promise<void> {
        const event = await getVotingEvent(eventId)
        if (event) {
            if (event.data?.payload?.type === ParticipationEventType.Voting) {
                votingPayload = event.data.payload
            } else {
                throw new Error('Event is a staking event')
            }
        } else {
            throw new Error('Event not found')
        }
    }

    async function updateIsVoting(): Promise<void> {
        try {
            isVotingForProposal = await isVotingForSelectedProposal()
        } catch (err) {
            handleError(err)
        }
    }

    function setVotedAnswerValuesAndTotalVotes(): void {
        let lastActiveOverview: TrackedParticipationOverview
        switch ($selectedParticipationEventStatus?.status) {
            case ProposalStatus.Upcoming:
                totalVotes = 0
                break
            case ProposalStatus.Commencing:
                lastActiveOverview = trackedParticipations?.find((overview) => overview.endMilestoneIndex === 0)
                totalVotes = 0
                break
            case ProposalStatus.Holding:
                lastActiveOverview = trackedParticipations?.find((overview) => overview.endMilestoneIndex === 0)
                totalVotes = calculateTotalVotesForTrackedParticipations(trackedParticipations)
                break
            case ProposalStatus.Ended:
                lastActiveOverview = trackedParticipations?.find(
                    (overview) => overview.endMilestoneIndex > $selectedProposal.milestones.ended
                )
                totalVotes = calculateTotalVotesForTrackedParticipations(trackedParticipations)
                break
        }
        votedAnswerValues = lastActiveOverview?.answers ?? []
    }

    let openedQuestionIndex = 0

    function handleQuestionClick(event: CustomEvent): void {
        const { questionIndex } = event.detail
        openedQuestionIndex = questionIndex === openedQuestionIndex ? null : questionIndex
    }

    function onStopVotingClick(): void {
        openPopup({
            type: 'stopVoting',
        })
    }

    function onVoteClick(): void {
        const chosenAnswerValues = selectedAnswerValues.map((answerValue) =>
            answerValue === undefined ? ABSTAIN_VOTE_VALUE : answerValue
        )
        openPopup({
            type: 'voteForProposal',
            props: { selectedAnswerValues: chosenAnswerValues },
        })
    }

    function handleAnswerClick(event: CustomEvent): void {
        const { answerValue, questionIndex } = event.detail
        selectedAnswerValues[questionIndex] = answerValue

        openedQuestionIndex = questionIndex + 1

        const selectedQuestionElement: HTMLElement = proposalQuestions?.querySelector(
            `proposal-question:nth-child(${openedQuestionIndex})`
        )
        setTimeout(() => {
            proposalQuestions.scrollTo({ top: selectedQuestionElement?.offsetTop, behavior: 'smooth' })
        }, 250)
    }

    function getTextHintString(): string {
        const millis =
            milestoneToDate(
                $networkStatus.currentMilestone,
                $selectedProposal.milestones[ProposalStatus.Commencing]
            ).getTime() - new Date().getTime()
        const timeString = getBestTimeDuration(millis, 'second')
        return localize('views.governance.details.hintVote', { values: { time: timeString } })
    }

    onMount(async () => {
        void pollParticipationEventStatus($selectedProposal?.id)
        // TODO: this api call gets all overviews, we need to change it so that we just get one
        // We then need to update the latest overview manually if we perform an action
        void updateParticipationOverview($selectedAccountIndex)
        await setVotingEventPayload($selectedProposal?.id)
        await updateIsVoting()
        hasMounted = true
    })

    onDestroy(() => {
        clearParticipationEventStatusPoll()
        clearSelectedParticipationEventStatus()
    })
</script>

<div class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-2/5 flex flex-col space-y-4">
        <Pane classes="p-6 flex flex-col h-fit">
            <header-container class="flex justify-between items-center mb-4">
                <ProposalStatusPill status={$selectedProposal?.status} />
                <ProposalDetailsButton />
            </header-container>
            <div class="flex flex-1 flex-col justify-between">
                <Text type={TextType.h2}>{$selectedProposal?.title}</Text>
                {#if $selectedProposal?.additionalInfo}
                    <Text
                        type={TextType.h5}
                        overrideColor
                        classes="text-gray-600 mt-4 max-h-40 overflow-hidden"
                        fontWeight={FontWeight.medium}>{$selectedProposal?.additionalInfo}</Text
                    >
                {/if}
            </div>
        </Pane>
        <Pane classes="p-6 h-fit">
            <Text smaller classes="mb-5">
                {localize('views.governance.details.yourVote.title')}
            </Text>
            <ul class="space-y-2">
                {#each Object.keys(votesCounter) as counterKey}
                    <li>
                        <KeyValueBox
                            keyText={localize(`views.governance.details.yourVote.${counterKey}`)}
                            valueText={formatTokenAmountBestMatch(votesCounter[counterKey], metadata)}
                        />
                    </li>
                {/each}
            </ul>
        </Pane>
        <ProposalInformation />
    </div>
    <Pane classes="w-3/5 h-full p-6 pr-3 flex flex-col justify-between ">
        <proposal-questions
            class="relative flex flex-1 flex-col space-y-5 overflow-y-scroll pr-3"
            bind:this={proposalQuestions}
        >
            {#if questions}
                {#each questions as question, questionIndex}
                    <ProposalQuestion
                        {question}
                        {questionIndex}
                        isOpened={openedQuestionIndex === questionIndex}
                        selectedAnswerValue={selectedAnswerValues[questionIndex]}
                        votedAnswerValue={votedAnswerValues[questionIndex]}
                        answerStatuses={$selectedParticipationEventStatus?.questions?.[questionIndex]?.answers}
                        on:clickQuestion={handleQuestionClick}
                        on:clickAnswer={handleAnswerClick}
                    />
                {/each}
            {/if}
        </proposal-questions>
        {#if $selectedProposal?.status === ProposalStatus.Upcoming}
            <TextHint info text={textHintString} />
        {:else if [ProposalStatus.Commencing, ProposalStatus.Holding].includes($selectedParticipationEventStatus?.status)}
            <buttons-container class="flex w-full space-x-4 mt-6">
                <Button
                    outline
                    classes="w-full"
                    onClick={onStopVotingClick}
                    disabled={!isVotingForProposal || isTransferring}
                    isBusy={isVotingForProposal && isTransferring}>{localize('actions.stopVoting')}</Button
                >
                <Button
                    classes="w-full"
                    disabled={isVotingDisabled || isTransferring}
                    isBusy={isTransferring}
                    onClick={onVoteClick}
                >
                    {localize('actions.vote')}
                </Button>
            </buttons-container>
        {/if}
    </Pane>
</div>
