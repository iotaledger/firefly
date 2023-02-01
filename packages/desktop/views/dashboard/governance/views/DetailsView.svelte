<script lang="ts">
    import { onMount } from 'svelte'
    import { VotingEventPayload, ParticipationEventType } from '@iota/wallet/out/types'
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
    import { governanceRouter } from '@core/router/routers'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { getVotingEvent } from '@contexts/governance/actions'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { participationOverview, selectedProposal, updateParticipationOverview } from '@contexts/governance/stores'
    import { calculateWeightedVotes, getActiveParticipation } from '@contexts/governance/utils'
    import { getBestTimeDuration, milestoneToDate } from '@core/utils'
    import { networkStatus } from '@core/network/stores'
    import { formatTokenAmountBestMatch } from '@core/wallet/utils'
    import { visibleSelectedAccountAssets } from '@core/wallet/stores'

    const { metadata } = $visibleSelectedAccountAssets?.baseCoin

    let selectedAnswerValues: number[] = []
    let votedAnswerValues: number[] = []
    let votingPayload: VotingEventPayload
    let totalVotes = 0
    let hasMounted = false
    let textHintString = ''
    let proposalQuestions: HTMLElement

    $: $selectedAccountIndex, void updateParticipationOverview()
    $: $selectedAccountIndex, (selectedAnswerValues = [])

    // Reactively start updating votes once component has mounted and participation overview is available.
    $: hasMounted && $participationOverview && $selectedProposal && setCurrentAndTotalVotes()

    $: votesCounter = {
        total: totalVotes,
        power: parseInt($selectedAccount?.votingPower),
    }
    $: questions = votingPayload?.questions

    $: if (questions?.length > 0 && selectedAnswerValues?.length === 0) {
        selectedAnswerValues =
            getActiveParticipation($selectedProposal?.id)?.answers ?? Array<number>(questions?.length)
    }

    $: isVotingDisabled =
        $selectedProposal?.state?.status === ProposalStatus.Upcoming ||
        $selectedProposal?.state?.status === ProposalStatus.Ended ||
        selectedAnswerValues?.length === 0 ||
        selectedAnswerValues?.includes(undefined) ||
        !hasChangedAnswers(selectedAnswerValues)

    $: isTransferring = $selectedAccount?.isTransferring
    $: $selectedProposal, (textHintString = getTextHintString())

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
            return _selectedAnswerValues.every((selectedAnswerValue) => selectedAnswerValue !== undefined)
        }
    }

    async function setVotingEventPayload(eventId: string): Promise<void> {
        const event = await getVotingEvent(eventId)
        if (event?.data?.payload?.type === ParticipationEventType.Voting) {
            votingPayload = event.data.payload
        } else {
            throw new Error('Event is a staking event!')
        }
    }

    function setCurrentAndTotalVotes(): void {
        const selectedProposalOverview = $participationOverview?.participations?.[$selectedProposal?.id]
        if (selectedProposalOverview) {
            const trackedParticipations = Object.values(selectedProposalOverview)
            const votes = calculateWeightedVotes(trackedParticipations)
            const lastActiveOverview = trackedParticipations.find(
                (overview) =>
                    overview.endMilestoneIndex === 0 || overview.endMilestoneIndex > $selectedProposal.milestones.ended
            )
            const votesSum = votes?.reduce((accumulator, votes) => accumulator + votes, 0) ?? 0

            votedAnswerValues = lastActiveOverview?.answers ?? []
            totalVotes =
                $selectedProposal?.state.status === ProposalStatus.Commencing
                    ? parseInt(lastActiveOverview?.amount, 10) ?? 0
                    : votesSum
        } else {
            votedAnswerValues = []
            totalVotes = 0
        }
    }

    let openedQuestionIndex = 0

    function handleQuestionClick(event: CustomEvent): void {
        const { questionIndex } = event.detail
        openedQuestionIndex = questionIndex

        const selectedQuestionElement: HTMLElement = proposalQuestions?.querySelector(
            'proposal-question:nth-child(' + openedQuestionIndex + ')'
        )
        setTimeout(() => {
            proposalQuestions.scrollTo({ top: selectedQuestionElement?.offsetTop, behavior: 'smooth' })
        }, 250)
    }

    function handleCancelClick(): void {
        $governanceRouter.previous()
    }

    function handleVoteClick(): void {
        openPopup({
            type: 'voteForProposal',
            props: { selectedAnswerValues },
        })
    }

    function handleAnswerClick(event: CustomEvent): void {
        const { answerValue, questionIndex } = event.detail
        selectedAnswerValues[questionIndex] = answerValue
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
        await setVotingEventPayload($selectedProposal?.id)
        hasMounted = true
    })
</script>

<div class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-2/5 flex flex-col space-y-4">
        <Pane classes="p-6 flex flex-col h-fit">
            <header-container class="flex justify-between items-center mb-4">
                <ProposalStatusPill status={$selectedProposal?.state.status} />
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
                        answerStatuses={$selectedProposal.state?.questions[questionIndex]?.answers}
                        on:clickQuestion={handleQuestionClick}
                        on:clickAnswer={handleAnswerClick}
                    />
                {/each}
            {/if}
        </proposal-questions>
        {#if $selectedProposal.state?.status === ProposalStatus.Upcoming}
            <TextHint info text={textHintString} />
        {:else if [ProposalStatus.Commencing, ProposalStatus.Holding].includes($selectedProposal.state?.status)}
            <buttons-container class="flex w-full space-x-4 mt-6">
                <Button outline classes="w-full" onClick={handleCancelClick}>{localize('actions.cancel')}</Button>
                <Button
                    classes="w-full"
                    disabled={isVotingDisabled || isTransferring}
                    isBusy={isTransferring}
                    onClick={handleVoteClick}
                >
                    {localize('actions.vote')}
                </Button>
            </buttons-container>
        {/if}
    </Pane>
</div>
