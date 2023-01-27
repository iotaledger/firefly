<script lang="typescript">
    import { onMount } from 'svelte'
    import { VotingEventPayload, ParticipationEventType } from '@iota/wallet/out/types'
    import { localize } from '@core/i18n'
    import {
        Button,
        KeyValueBox,
        Pane,
        ProposalDetailsButton,
        ProposalInformation,
        ProposalQuestion,
        ProposalStatusPill,
        Text,
        TextType,
    } from '@ui'
    import { openPopup } from '@auxiliary/popup/actions'
    import { governanceRouter } from '@core/router/routers'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { getVotingEvent } from '@contexts/governance/actions'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { participationOverview, selectedProposal, updateParticipationOverview } from '@contexts/governance/stores'
    import { calculateWeightedVotes } from '@contexts/governance/utils'
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
    let voteButtonText = localize('actions.vote')

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
        selectedAnswerValues = Array<number>(questions?.length)
    }
    $: isVotingDisabled =
        $selectedProposal?.state?.status === ProposalStatus.Upcoming ||
        $selectedProposal?.state?.status === ProposalStatus.Ended ||
        selectedAnswerValues?.length === 0 ||
        selectedAnswerValues?.includes(undefined)

    $: isTransferring = $selectedAccount?.isTransferring
    $: $selectedProposal, (voteButtonText = getVoteButtonText())

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

    let openedQuestionIndex = null

    function handleQuestionClick(event: CustomEvent): void {
        const { questionIndex } = event.detail
        openedQuestionIndex = openedQuestionIndex === questionIndex ? null : questionIndex
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
        if (selectedAnswerValues[questionIndex] === answerValue) {
            selectedAnswerValues[questionIndex] = null
        } else {
            selectedAnswerValues[questionIndex] = answerValue
        }
    }

    function getVoteButtonText(): string {
        if ($selectedProposal?.state.status === ProposalStatus.Upcoming) {
            const millis =
                milestoneToDate(
                    $networkStatus.currentMilestone,
                    $selectedProposal.milestones[ProposalStatus.Commencing]
                ).getTime() - new Date().getTime()
            const timeString = getBestTimeDuration(millis, 'second')
            return localize('views.governance.details.voteOpens', { values: { time: timeString } })
        } else {
            return localize('actions.vote')
        }
    }

    onMount(async () => {
        await setVotingEventPayload($selectedProposal?.id)
        hasMounted = true
    })
</script>

<div class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-2/5 flex flex-col space-y-4">
        <Pane classes="p-6 flex flex-col flex-1">
            <header-container class="flex justify-between items-center mb-4">
                <ProposalStatusPill status={$selectedProposal?.state.status} />
                <ProposalDetailsButton />
            </header-container>
            <div class="flex flex-1 flex-col justify-between">
                <Text type={TextType.h2}>{$selectedProposal?.title}</Text>
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
    <Pane classes="w-3/5 h-full p-6 flex flex-col justify-between ">
        <proposal-questions class="flex flex-1 flex-col space-y-5 overflow-y-scroll">
            {#if questions}
                {#each questions as question, questionIndex}
                    <ProposalQuestion
                        {question}
                        {questionIndex}
                        isOpened={openedQuestionIndex === questionIndex}
                        selectedAnswerValue={selectedAnswerValues[questionIndex]}
                        votedAnswerValue={votedAnswerValues[questionIndex]}
                        allVotes={$selectedProposal?.state?.questions[questionIndex]?.answers}
                        on:clickQuestion={handleQuestionClick}
                        on:clickAnswer={handleAnswerClick}
                    />
                {/each}
            {/if}
        </proposal-questions>
        <buttons-container class="flex w-full space-x-4 mt-6">
            <Button outline classes="w-full" onClick={handleCancelClick}>{localize('actions.cancel')}</Button>
            <Button
                classes="w-full"
                disabled={isVotingDisabled || isTransferring}
                isBusy={isTransferring}
                onClick={handleVoteClick}
            >
                {voteButtonText}
            </Button>
        </buttons-container>
    </Pane>
</div>
