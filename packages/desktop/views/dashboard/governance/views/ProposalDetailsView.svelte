<script lang="ts">
    import { VotingEventPayload, ParticipationEventType, TrackedParticipationOverview } from '@iota/sdk/out/types'

    import { onMount, onDestroy } from 'svelte'

    import { Button, Height, KeyValueBox, MarkdownBlock, Pane, ProposalStatusPill, Text, TextHint, TextType } from '@ui'
    import { ProposalDetailsButton, ProposalInformationPane, ProposalQuestion } from '@components'

    import { selectedWallet } from '@core/wallet/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { networkStatus } from '@core/network/stores'
    import { getBestTimeDuration, slotToDate } from '@core/utils'
    import { visibleSelectedWalletAssets } from '@core/wallet/stores'
    import { formatTokenAmountBestMatch } from '@core/wallet/utils'

    import { getVotingEvent } from '@contexts/governance/actions'
    import {
        clearParticipationEventStatusPoll,
        pollParticipationEventStatus,
    } from '@contexts/governance/actions/pollParticipationEventStatus'
    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import { ProposalStatus } from '@contexts/governance/enums'
    import {
        clearSelectedParticipationEventStatus,
        participationOverviewForSelectedWallet,
        selectedParticipationEventStatus,
        selectedProposal,
        updateParticipationOverviewForEventId,
    } from '@contexts/governance/stores'
    import {
        calculateTotalVotesForTrackedParticipations,
        getActiveParticipation,
        isProposalVotable,
        isVotingForSelectedProposal,
    } from '@contexts/governance/utils'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { activeProfile } from '@core/profile'
    import { TextHintVariant } from 'shared/components/enums'

    const { metadata } = $visibleSelectedWalletAssets?.[$activeProfile?.network?.id]?.baseCoin ?? {}

    let selectedAnswerValues: number[] = []
    let votedAnswerValues: number[] = []
    let votingPayload: VotingEventPayload
    let totalVotes = 0
    let hasMounted = false
    let textHintString = ''
    let proposalQuestions: HTMLElement
    let isVotingForProposal: boolean = false
    let statusLoaded: boolean = false
    let overviewLoaded: boolean = false
    let openedQuestionIndex: number = -1
    let isUpdatingVotedAnswerValues: boolean = false
    let lastAction: 'vote' | 'stopVote'

    $: selectedProposalOverview = $participationOverviewForSelectedWallet?.participations?.[$selectedProposal?.id]
    $: trackedParticipations = Object.values(selectedProposalOverview ?? {})
    $: currentSlot = $networkStatus.currentSlot

    // Reactively start updating votes once component has mounted and participation overview is available.
    $: hasMounted &&
        $selectedParticipationEventStatus &&
        trackedParticipations &&
        currentSlot &&
        setVotedAnswerValuesAndTotalVotes()
    $: hasMounted && selectedProposalOverview && updateIsVoting()

    $: questions = votingPayload?.questions

    $: if (questions?.length > 0 && selectedAnswerValues?.length === 0) {
        selectedAnswerValues = [
            ...(getActiveParticipation($selectedProposal?.id)?.answers ?? Array.from({ length: questions?.length })),
        ]
    }

    $: $selectedParticipationEventStatus, (textHintString = getTextHintString())

    $: hasGovernanceTransactionInProgress =
        $selectedWallet?.hasVotingPowerTransactionInProgress || $selectedWallet?.hasVotingTransactionInProgress

    $: areSelectedAndVotedAnswersEqual = JSON.stringify(selectedAnswerValues) === JSON.stringify(votedAnswerValues)

    $: {
        if (hasGovernanceTransactionInProgress) {
            isUpdatingVotedAnswerValues = true
        }

        const hasVoted = lastAction === 'vote' && areSelectedAndVotedAnswersEqual
        const hasStoppedVoting = lastAction === 'stopVote' && !areSelectedAndVotedAnswersEqual
        if (hasVoted || hasStoppedVoting) {
            isUpdatingVotedAnswerValues = hasGovernanceTransactionInProgress
        }
    }

    function hasSelectedNoAnswers(_selectedAnswerValues: number[]): boolean {
        return (
            _selectedAnswerValues.length === 0 ||
            _selectedAnswerValues.every((answerValue) => answerValue === undefined)
        )
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

    // TODO(2.0): Update ProposalStatus when ParticipationEventData and TrackedParticipationOverview has been updated
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
                    (overview) => overview.endMilestoneIndex > $selectedProposal.slots.ended
                )
                totalVotes = calculateTotalVotesForTrackedParticipations(trackedParticipations)
                break
        }
        votedAnswerValues = lastActiveOverview?.answers ?? []
    }

    function onQuestionClick(questionIndex: number): void {
        openedQuestionIndex = questionIndex === openedQuestionIndex ? null : questionIndex
    }

    function onStopVotingClick(): void {
        lastAction = 'stopVote'
        openPopup({
            id: PopupId.StopVoting,
        })
    }

    function onVoteClick(): void {
        lastAction = 'vote'
        const chosenAnswerValues = selectedAnswerValues.map((answerValue) =>
            answerValue === undefined ? ABSTAIN_VOTE_VALUE : answerValue
        )
        openPopup({
            id: PopupId.VoteForProposal,
            props: { selectedAnswerValues: chosenAnswerValues },
        })
    }

    function onAnswerClick(answerValue: number, questionIndex: number): void {
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
        if (!$selectedProposal) {
            return ''
        }

        const millis =
            slotToDate($networkStatus.currentSlot, $selectedProposal.milestones[ProposalStatus.Commencing]).getTime() -
            new Date().getTime()
        const timeString = getBestTimeDuration(millis, 'second')
        return localize('views.governance.details.hintVote', { values: { time: timeString } })
    }

    onMount(async () => {
        // Callbacks used, because we don't want to await the resolution of the promises.
        pollParticipationEventStatus($selectedProposal?.id).then(() => (statusLoaded = true))
        updateParticipationOverviewForEventId($selectedProposal?.id).then(() => (overviewLoaded = true))
        await setVotingEventPayload($selectedProposal?.id)
        await updateIsVoting()
        openedQuestionIndex = votingPayload?.questions.length > 1 ? -1 : 0
        hasMounted = true
    })

    onDestroy(() => {
        clearParticipationEventStatusPoll()
        clearSelectedParticipationEventStatus()
    })
</script>

<proposal-details class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-2/5 flex flex-col space-y-4 relative">
        <Pane height={Height.Fit}>
            <div class="flex flex-col overflow-hidden h-full">
                <header-container class="flex justify-between items-center mb-4">
                    <ProposalStatusPill proposal={$selectedProposal} />
                    <ProposalDetailsButton proposal={$selectedProposal} />
                </header-container>
                <div class="flex flex-1 flex-col space-y-4 justify-between scrollable-y">
                    <Text type={TextType.h2}>{$selectedProposal?.title}</Text>
                    {#if $selectedProposal?.additionalInfo}
                        <MarkdownBlock text={$selectedProposal?.additionalInfo} />
                    {/if}
                </div>
            </div>
        </Pane>
        <Pane height={Height.Fit}>
            <div class="shrink-0">
                <Text smaller classes="mb-5">
                    {localize('views.governance.details.yourVote.title')}
                </Text>
                <ul class="space-y-2">
                    <li>
                        <KeyValueBox
                            keyText={localize('views.governance.details.yourVote.total')}
                            valueText={formatTokenAmountBestMatch(totalVotes, metadata)}
                            isLoading={!overviewLoaded}
                        />
                    </li>
                    <li>
                        <KeyValueBox
                            keyText={localize('views.governance.details.yourVote.power')}
                            valueText={formatTokenAmountBestMatch(parseInt($selectedWallet?.votingPower), metadata)}
                        />
                    </li>
                </ul>
            </div>
        </Pane>
        <div class="shrink-0">
            <ProposalInformationPane />
        </div>
    </div>
    <div class="w-3/5">
        <Pane height={Height.Full}>
            <div class="flex flex-col justify-between">
                <proposal-questions
                    class="relative flex flex-1 flex-col space-y-5 overflow-y-scroll"
                    bind:this={proposalQuestions}
                >
                    {#if questions}
                        {#each questions as question, questionIndex}
                            <ProposalQuestion
                                {question}
                                {questionIndex}
                                isOpened={openedQuestionIndex === questionIndex}
                                isLoading={!overviewLoaded || !statusLoaded}
                                selectedAnswerValue={selectedAnswerValues[questionIndex]}
                                votedAnswerValue={votedAnswerValues[questionIndex]}
                                answerStatuses={$selectedParticipationEventStatus?.questions[questionIndex]?.answers}
                                {onQuestionClick}
                                {onAnswerClick}
                            />
                        {/each}
                    {/if}
                </proposal-questions>
                {#if $selectedProposal?.status === ProposalStatus.Upcoming}
                    <TextHint variant={TextHintVariant.Info} text={textHintString} />
                {:else if [ProposalStatus.Commencing, ProposalStatus.Holding].includes($selectedProposal?.status)}
                    {@const isLoaded = questions && overviewLoaded && statusLoaded}
                    {@const isStoppingVote = lastAction === 'stopVote' && hasGovernanceTransactionInProgress}
                    {@const isStopVotingDisabled = !isLoaded || !isVotingForProposal || isUpdatingVotedAnswerValues}
                    {@const isVoting = lastAction === 'vote' && hasGovernanceTransactionInProgress}
                    {@const isVotingDisabled =
                        !isLoaded ||
                        !isProposalVotable($selectedProposal?.status) ||
                        hasSelectedNoAnswers(selectedAnswerValues) ||
                        isUpdatingVotedAnswerValues ||
                        areSelectedAndVotedAnswersEqual}
                    <buttons-container class="flex w-full space-x-4 mt-6">
                        <Button
                            outline
                            classes="w-full"
                            onClick={onStopVotingClick}
                            disabled={isStopVotingDisabled}
                            isBusy={isStoppingVote}
                        >
                            {localize('actions.stopVoting')}
                        </Button>
                        <Button classes="w-full" onClick={onVoteClick} disabled={isVotingDisabled} isBusy={isVoting}>
                            {localize('actions.vote')}
                        </Button>
                    </buttons-container>
                {/if}
            </div>
        </Pane>
    </div>
</proposal-details>
