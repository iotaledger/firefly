<script lang="typescript">
    import { Button, DashboardPane, Icon, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { canParticipate } from 'shared/lib/participation'
    import { participationOverview } from 'shared/lib/participation/stores'
    import { ParticipationEvent, ParticipationEventState, VotingEventAnswer } from 'shared/lib/participation/types'
    import { openPopup } from 'shared/lib/popup'
    import { governanceRoute } from 'shared/lib/router'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { selectedAccount } from 'shared/lib/wallet'
    import type { WalletAccount } from 'shared/lib/typings/wallet';
    import { milestoneToDate, getBestTimeDuration, getDurationString } from 'shared/lib/time'
    import { AccountColors } from 'shared/lib/wallet'
    
    export let event: ParticipationEvent;
    export let account: WalletAccount

    let currentVoteValue: string
    // TODO: base it on selectedAccountId when exposed in feat/single-wallet
    $: $selectedAccount, $participationOverview, updateCurrentVoteValue()

    const handleBackClick = (): void => governanceRoute.set(GovernanceRoutes.Init)

    const handleClick = (nextVote: VotingEventAnswer): void => {
        openPopup({
            type: 'governanceCastVote',
            props: {
                currentVoteValue,
                eventId: event?.eventId,
                nextVote,
            },
        })
    }

    const length = milestoneToDate(event?.information?.milestoneIndexEnd).getMilliseconds() - milestoneToDate(event?.information?.milestoneIndexStart).getMilliseconds()
    const progress = new Date().getMilliseconds() - milestoneToDate(event?.information?.milestoneIndexEnd).getMilliseconds()

    // const totalVotes = $participationOverview.find(acc => acc?.accountIndex === account?.index)?.trackedParticipations?.amount // TODO: fix object structure 
    const totalVotes = 2000
    
    const getAnswerHeader = (castedAnswerValue: string, answerValue: string): string => {
        if (isSelected(castedAnswerValue, answerValue)) {
            return setActiveText()
        } else if (castedAnswerValue) {
            return 'Not Selected'
        } else {
            return `Option ${answerValue}`
        }
    }

    // const results = $participationOverview?.status?.questions?.answers?.filter(answer => event?.information?.payload?.questions[0]?.answers?.find(_answer => _answer?.value === answer?.value)) // TODO: fix object structure
    const results = [ { "value": 1, "current": 0, "accumulated": 38000 }, { "value": 2, "current": 0, "accumulated": 62000 } ]
    const totalVotesResult = results.reduce((acc, val) => acc + val.accumulated, 0)
    const displayedPercentages = results.map((result) => {
        return { 
            percentage: `${Math.round(result.accumulated / totalVotesResult * 100)}%`,
            relativePercentage: `${result.accumulated / Math.max(...results.map(result => result.accumulated)) * 100}%`,
        }
    })

    const setActiveText = (): string => {
        if (event?.status?.status === ParticipationEventState.Holding) {
            return 'Active Voting'
        }
        return 'Selected'
    }

    const isSelected = (castedAnswerValue: string, answerValue: string): boolean => castedAnswerValue === answerValue

    const updateCurrentVoteValue = (): void => {
        const selectedAccountOverview = $participationOverview.find(
            ({ accountIndex }) => accountIndex === $selectedAccount.index
        )
        const participation = selectedAccountOverview?.participations?.find(
            (participation) => participation.eventId === event.eventId
        )
        currentVoteValue = participation?.answers[0] ?? null
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

<div class="w-full h-full grid grid-cols-3 grid-rows-2 gap-4 min-h-0">
    <DashboardPane classes="w-full h-full p-6 col-span-2 row-span-2 flex flex-col">
        <div class="flex flex-start items-center mb-2">
            <Text type="p" classes="px-2 py-1 text-blue-500 bg-blue-100 rounded-lg" smaller bold overrideColor>{localize(`views.governance.events.status.${event?.status?.status}`)}</Text>
            <Icon icon="info-filled" classes="ml-2 text-gray-400" />
        </div>
        <Text type="h2" classes="mb-4">{event?.information?.name}</Text>
        <Text type="p" classes="mb-2">{event?.information?.additionalInfo}</Text>
        <Text type="p" classes="mb-2">{event?.information?.payload?.questions[0]?.text}</Text>
        <Text type="p" classes="mb-6">{event?.information?.payload?.questions[0]?.additionalInfo}</Text>
        {#each event?.information?.payload?.questions[0]?.answers as answer}
            <Button
                onClick={() => handleClick(answer)}
                secondary
                disabled={!canParticipate(event?.status?.status)}
                classes="px-6 bg-{isSelected(currentVoteValue, answer?.value)
                    ? 'blue-100'
                    : 'gray-50'} hover:bg-gray-100 border border-solid border-gray-100 flex justify-between mb-4"
            >
                <div>
                    <div class="flex items-center mb-2">
                        {#if isSelected(currentVoteValue, answer?.value)}
                            <Icon width="16" height="16" icon="checkbox-round" classes="text-blue-500 mr-2" />
                        {/if}
                        <Text type="p" classes="uppercase text-blue-500" overrideColor smaller bold>
                            {getAnswerHeader(currentVoteValue, answer?.value)}
                        </Text>
                    </div>
                    <Text type="h3" classes="mb-2">{answer?.text}</Text>
                    <Text type="p">{answer?.additionalInfo}</Text>
                </div>
                {#if canParticipate(event?.status?.status)}
                    <div class="my-auto">
                        <Icon icon="chevron-right" />
                    </div>
                {/if}
            </Button>
        {/each}
    </DashboardPane>
    <div class="row-span-1">
        <DashboardPane classes="w-full h-full flex flex-row flex-shrink-0 overflow-hidden p-6">
            <div class="space-y-5">
                <div>
                    <Text type="p" smaller classes="mb-3 text-gray-700" overrideColor>{localize('views.governance.votingPower.title')}</Text>
                    <Text type="h2" classes="inline-flex items-end">{account?.balance}</Text>
                </div>
                {#if event?.status?.status === ParticipationEventState.Upcoming}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700" overrideColor>{localize('views.governance.eventDetails.votingOpens')}</Text>
                        <Text type="h3" classes="inline-flex items-end">{milestoneToDate(event?.information?.milestoneIndexCommence).toString()}</Text>
                    </div>
                {/if}
                {#if event?.status?.status === ParticipationEventState.Upcoming || event?.status?.status === ParticipationEventState.Commencing}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700" overrideColor>{localize('views.governance.eventDetails.countingStarts')}</Text>
                        <Text type="h3" classes="inline-flex items-end">{milestoneToDate(event?.information?.milestoneIndexStart).toString()}</Text>
                    </div>
                {/if}
                {#if event?.status?.status === ParticipationEventState.Commencing}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700" overrideColor>{localize('views.governance.eventDetails.countingStarts')}</Text>
                        <Text type="h3" classes="inline-flex items-end">{getBestTimeDuration(length)}</Text>
                    </div>
                {/if}
                {#if event?.status?.status === ParticipationEventState.Holding || event?.status?.status === ParticipationEventState.Ended}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700" overrideColor>{localize('views.governance.eventDetails.votesCounted')}</Text>
                        <Text type="h3" classes="inline-flex items-end">{totalVotes}</Text>
                    </div>
                {/if}
                {#if event?.status?.status === ParticipationEventState.Holding || event?.status?.status === ParticipationEventState.Ended}
                    <div>
                        <Text type="p" smaller classes="mb-3 text-gray-700" overrideColor>{localize('views.governance.eventDetails.votingProgress')}</Text>
                        <Text type="h3" classes="inline-flex items-end">{getDurationString(progress)}</Text>
                    </div>
                {/if}
            </div>
            <Icon icon="info-filled" classes="ml-auto mt-0 text-gray-400" />
        </DashboardPane>
    </div>
    {#if event?.status?.status === ParticipationEventState.Holding || event?.status?.status === ParticipationEventState.Ended}
        <DashboardPane classes="w-full h-full flex flex-col flex-shrink-0 overflow-hidden p-6">
            <Text type="p" smaller classes="mb-8 text-gray-700" overrideColor>{localize('views.governance.eventDetails.currentResults')}</Text>
            <div class="w-full h-full flex justify-center space-x-16">
            {#each results as result, i}
                <div class="h-full flex flex-col justify-end items-center">
                    <div class="w-12 rounded-t-lg" style="height: {displayedPercentages[i]?.relativePercentage}; background-color: {Object.values(AccountColors)[i]};"></div>
                    <div class="flex space-x-1 mt-3">
                        <Text type="h3">{event?.information?.payload?.questions[0]?.answers[i]?.text?.split(" ")[0]}</Text>
                        <Text type="h3" overrideColor classes="text-gray-500">{displayedPercentages[i].percentage}</Text>
                    </div>
                    <Text type="p" overrideColor bigger classes="text-gray-500 m-0">{result.accumulated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </div>
            {/each}
            </div>
        </DashboardPane>
    {/if}
</div>
