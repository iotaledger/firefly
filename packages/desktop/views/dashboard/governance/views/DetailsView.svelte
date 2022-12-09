<script lang="typescript">
    import { selectedProposal } from '@core/governance'
    import { formatDate, localize } from '@core/i18n'
    import { networkStatus } from '@core/network'
    import { milestoneToDate } from '@core/utils'
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
    } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { getVotingEvent } from '@core/profile-manager'
    import { getParticipationOverview, selectedAccount } from '@core/account'
    import { Event, TrackedParticipationOverview } from '@iota/wallet'

    const dateFormat = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    } as Intl.DateTimeFormatOptions

    let event: Event
    $: {
        getVotingEvent($selectedProposal?.id).then((votingEvent) => (event = votingEvent))
    }
    let selectedProposalOverview: TrackedParticipationOverview[]
    $: {
        getParticipationOverview($selectedAccount?.index).then((participationOverview) => {
            selectedProposalOverview = participationOverview.participations
                ?.filter((participation) => participation[0] === $selectedProposal?.id)
                ?.map((participation) => participation[1][1])
        })
    }
    $: totalVotes =
        selectedProposalOverview?.reduce(
            (acc, trackedParticipation) =>
                trackedParticipation.amount ? parseInt(trackedParticipation.amount, 10) + acc : acc,
            0
        ) ?? 0
    $: votesCounter = {
        total: totalVotes,
        power: $selectedAccount?.votingPower,
    }
    $: questions = event?.data?.payload?.questions

    const proposalInformation = {
        countingEnds: formatDate(
            milestoneToDate($networkStatus.currentMilestone, $selectedProposal?.milestones?.closed),
            dateFormat
        ),
        eventId: $selectedProposal?.id,
        nodeUrl: 'jfjk821391290jha.url', // mocked data
    }

    let openedQuestionIndex = null

    function handleMeatballMenu(): void {
        return
    }

    function handleQuestionClick(index: number): void {
        openedQuestionIndex = openedQuestionIndex === index ? null : index
    }
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
        <Pane classes="p-6 h-fit">
            <Text smaller classes="mb-5">
                {localize('views.governance.details.proposalInformation.title')}
            </Text>
            <ul class="space-y-2">
                {#each Object.keys(proposalInformation) as counterKey}
                    <li class="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <Text fontWeight={FontWeight.medium} overrideColor classes="text-gray-600">
                            {localize(`views.governance.details.proposalInformation.${counterKey}`)}
                        </Text>
                        <Text overrideColor classes="text-gray-600">
                            {proposalInformation[counterKey]}
                        </Text>
                    </li>
                {/each}
            </ul>
        </Pane>
    </div>
    <Pane classes="w-3/5 h-full p-6 flex flex-col justify-between ">
        <proposal-questions class="flex flex-1 flex-col space-y-5 overflow-y-scroll">
            {#each questions as question, index}
                <ProposalQuestion
                    {question}
                    isOpened={openedQuestionIndex === index}
                    {index}
                    onClick={() => handleQuestionClick(index)}
                />
            {/each}
        </proposal-questions>
        <buttons-container class="flex w-full space-x-4 mt-6">
            <Button outline classes="w-full">{localize('actions.cancel')}</Button>
            <Button classes="w-full">{localize('actions.vote')}</Button>
        </buttons-container>
    </Pane>
</div>
