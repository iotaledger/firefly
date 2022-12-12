<script lang="typescript">
    import { selectedProposal } from '@core/governance'
    import { localize } from '@core/i18n'
    import {
        Button,
        Text,
        MeatballMenuButton,
        Pane,
        ProposalStatusPill,
        TextType,
        FontWeight,
        Icon,
        ProposalQuestion,
        ProposalInformation,
    } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { getVotingEvent } from '@core/profile-manager'
    import { selectedAccount } from '@core/account'
    import type { Event } from '@iota/wallet'
    import { Question } from '@core/governance/interfaces'

    enum EventType {
        VotingEvent,
        StakingEvent,
    }

    interface VotingEventPayload {
        type: number
        questions: Question[]
    }

    let selectedIndices: number[] = []
    let votingEvent: Event
    let votingPayload: VotingEventPayload
    $: void setVotingEvent($selectedProposal?.id)

    // TODO: calculateVotes function needs to take into account the time
    $: totalVotes = void calculateTotalVotes()
    $: votesCounter = {
        total: totalVotes,
        power: $selectedAccount?.votingPower,
    }
    $: questions = votingPayload?.questions

    $: if (questions?.length > 0 && selectedIndices?.length === 0) {
        selectedIndices = Array<number>(questions?.length)
    }

    async function setVotingEvent(eventId: string): Promise<void> {
        const event = await getVotingEvent(eventId)
        if (event?.data?.payload?.type === EventType.VotingEvent) {
            votingEvent = event
            votingPayload = event.data.payload as VotingEventPayload
        } else {
            throw new Error('Event is a staking event!')
        }
    }

    // TODO: track the votes after voting has been done
    function calculateTotalVotes(): number {
        // const participations = (await getParticipationOverview($selectedAccount?.index))?.participations
        // console.log(0, participations)
        // const selectedProposalOverview = participations
        //         ?.filter((participation) => participation[0] === $selectedProposal?.id)
        // const votes = selectedProposalOverview?.map((participation) => participation[1][1])
        // selectedProposalOverview?.reduce(
        //     (acc, trackedParticipation) =>
        //         trackedParticipation.amount ? parseInt(trackedParticipation.amount, 10) + acc : acc,
        //     0
        // ) ?? 0
        return 10000
    }

    let openedQuestionIndex = null

    function handleMeatballMenu(): void {
        return
    }

    function handleQuestionClick(index: number): void {
        // console.log(index)
        // console.log(proposalInformation)
        openedQuestionIndex = openedQuestionIndex === index ? null : index
    }

    // async function handleVoteClick(): Promise<void> {
    //     console.log(`Vote w/`)
    // }
</script>

<div class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-4 bg-gray-50 dark:bg-gray-900">
    <div class="w-2/5 flex flex-col space-y-4">
        <Pane classes="p-6 flex flex-col flex-1">
            <header-container class="flex justify-between items-center mb-4">
                <ProposalStatusPill status={$selectedProposal?.status} />
                <MeatballMenuButton onClick={handleMeatballMenu} />
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
                {#each questions as question, index}
                    <ProposalQuestion
                        {question}
                        isOpened={openedQuestionIndex === index}
                        {index}
                        bind:selectedIndices
                        onClick={() => handleQuestionClick(index)}
                    />
                {/each}
            {/if}
        </proposal-questions>
        <buttons-container class="flex w-full space-x-4 mt-6">
            <Button outline classes="w-full">{localize('actions.cancel')}</Button>
            <Button classes="w-full">{localize('actions.vote')}</Button>
        </buttons-container>
    </Pane>
</div>
