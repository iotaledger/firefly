<script lang="typescript">
    import { onMount } from 'svelte'
    import { VotingEventPayload, ParticipationEventType } from '@iota/wallet/out/types'
    import { localize } from '@core/i18n'
    import {
        Button,
        FontWeight,
        Icon,
        Pane,
        ProposalDetailsButton,
        ProposalInformation,
        ProposalQuestion,
        ProposalStatusPill,
        Text,
        TextType,
    } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup'
    import { activeProfileId } from '@core/profile/stores'
    import { networkStatus } from '@core/network/stores'
    import { getVotingEvent } from '@core/profile-manager'
    import { governanceRouter } from '@core/router'
    import { getParticipationOverview, selectedAccount } from '@core/account'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { proposalsState, selectedProposal } from '@contexts/governance/stores'

    let selectedAnswerValues: number[] = []
    let votedAnswerValues: number[] = []
    let votingPayload: VotingEventPayload
    let totalVotes = 0

    $: proposalState = $proposalsState[$activeProfileId]?.[$selectedProposal?.id]?.state
    $: votesCounter = {
        total: totalVotes,
        power: $selectedAccount?.votingPower,
    }
    $: questions = votingPayload?.questions

    $: if (questions?.length > 0 && selectedAnswerValues?.length === 0) {
        selectedAnswerValues = Array<number>(questions?.length)
    }
    $: isVotingDisabled =
        proposalState?.status === ProposalStatus.Upcoming ||
        proposalState?.status === ProposalStatus.Ended ||
        selectedAnswerValues?.length === 0 ||
        selectedAnswerValues?.includes(undefined)

    $: isTransferring = $selectedAccount?.isTransferring

    async function setVotingEventPayload(eventId: string): Promise<void> {
        const event = await getVotingEvent(eventId)
        if (event?.data?.payload?.type === ParticipationEventType.Voting) {
            votingPayload = event.data.payload
        } else {
            throw new Error('Event is a staking event!')
        }
    }

    async function setCurrentAndTotalVotes(): Promise<void> {
        const { participations } = (await getParticipationOverview($selectedAccount?.index)) ?? {}
        const trackedParticipations = Object.values(participations[$selectedProposal?.id] ?? {})

        const votes = trackedParticipations.map(({ amount, startMilestoneIndex, endMilestoneIndex }) => {
            const endMilestone = endMilestoneIndex <= 0 ? $networkStatus?.currentMilestone : endMilestoneIndex
            return parseInt(amount) * (endMilestone - startMilestoneIndex)
        })

        votedAnswerValues = trackedParticipations.find((overview) => overview.endMilestoneIndex === 0)?.answers ?? []
        totalVotes = votes?.reduce((accumulator, votes) => accumulator + votes, 0) ?? 0
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

    function handleAnswerClick(event: CustomEvent) {
        const { answerValue, questionIndex } = event.detail
        if (selectedAnswerValues[questionIndex] === answerValue) {
            selectedAnswerValues[questionIndex] = null
        } else {
            selectedAnswerValues[questionIndex] = answerValue
        }
    }

    onMount(async () => {
        await setVotingEventPayload($selectedProposal?.id)
        await setCurrentAndTotalVotes()
    })
</script>

<div class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-2/5 flex flex-col space-y-4">
        <Pane classes="p-6 flex flex-col flex-1">
            <header-container class="flex justify-between items-center mb-4">
                <ProposalStatusPill status={$selectedProposal?.status} />
                <ProposalDetailsButton />
            </header-container>
            <div class="flex flex-1 flex-col justify-between">
                <Text type={TextType.h2}>{$selectedProposal?.title}</Text>
                <div class="flex items-center cursor-pointer">
                    <Text fontSize="14" fontWeight={FontWeight.semibold} overrideColor classes="text-blue-500"
                        >{localize('views.governance.details.fullProposal')}</Text
                    >
                    <Icon icon={IconEnum.Link} height={16} classes="ml-0.5 text-blue-500" />
                </div>
            </div>
        </Pane>
        <Pane classes="p-6 h-fit">
            <Text smaller classes="mb-5">
                {localize('views.governance.details.yourVote.title')}
            </Text>
            <ul class="space-y-2">
                {#each Object.keys(votesCounter) as counterKey}
                    <li class="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <Text fontWeight={FontWeight.medium} overrideColor classes="text-gray-600">
                            {localize(`views.governance.details.yourVote.${counterKey}`)}
                        </Text>
                        <Text overrideColor classes="text-gray-600">
                            {votesCounter[counterKey]}
                        </Text>
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
                        allVotes={proposalState?.questions[questionIndex]?.answers}
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
                {localize('actions.vote')}
            </Button>
        </buttons-container>
    </Pane>
</div>
