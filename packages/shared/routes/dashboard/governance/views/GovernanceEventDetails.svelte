<script lang="typescript">
    import { Text, Icon, DashboardPane } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { governanceRoute } from 'shared/lib/router'
    import { openPopup } from 'shared/lib/popup'
    import { participationOverview } from 'shared/lib/participation/stores';
    import { ParticipationEvent, ParticipationEventState, VotingEventAnswer } from 'shared/lib/participation/types'
    
    export let event: ParticipationEvent;

    let currentVoteValue: string;
    $: {
        const overview = $participationOverview[0];
        const participation = overview?.participations.find(
            (participation) => participation.eventId === event.eventId
        )
        currentVoteValue = participation?.answers[0] ?? null
    }

    const handleBackClick = (): void => governanceRoute.set(GovernanceRoutes.Init)

    const handleClick = (nextVote: VotingEventAnswer): void => {
        openPopup({
            type: 'governanceCastVote',
            props: {
                currentVoteValue,
                eventId: event?.eventId,
                nextVote,
            }
        })
    }

    const getAnswerHeader = (answerValue: string): string => {
        if (isSelected(answerValue)) {
            return setActiveText()
        } else if (currentVoteValue) {
            return 'Not Selected'
        } else {
            return `Option ${answerValue}`
        }
    }

    const setActiveText = (): string => {
        if (event?.status?.status === ParticipationEventState.Holding) {
            return 'Active Voting'
        }
        return 'Selected'
    }

    const isSelected = (answerValue: string): boolean => currentVoteValue === answerValue
</script>

<div
    on:click={handleBackClick}
    class="inline-flex justify-between items-center w-20 p-2 pr-4 bg-white hover:bg-gray-100 border
    rounded-lg border-solid border-gray-300 cursor-pointer mb-5">
    <Icon icon="arrow-left" classes="w-4 h-4 text-gray-500" />
    <Text type="p" smaller overrideColor classes="text-gray-800">{localize('actions.back')}</Text>
</div>

<div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
    <DashboardPane classes="w-full h-full p-6 col-span-2 flex flex-col">
        <Text type="p" classes="mr-auto uppercase px-2 py-1 mb-2 text-blue-500 bg-blue-100 rounded-lg" smaller bold overrideColor>{event?.status?.status}</Text>
        <Text type="h2" classes="mb-4">{event?.information?.name}</Text>
        <Text type="p" classes="mb-2">{event?.information?.additionalInfo}</Text>
        <Text type="p" classes="mb-2">{event?.information?.payload?.questions[0]?.text}</Text>
        <Text type="p" classes="mb-6">{event?.information?.payload?.questions[0]?.additionalInfo}</Text>
        {#each event?.information?.payload?.questions[0]?.answers as answer}
            <div
                on:click={() => handleClick(answer)} 
                class="py-4 px-6 bg-{isSelected(answer?.value) ? 'blue-100' : 'gray-50'} hover:bg-gray-100 border border-solid border-gray-100 rounded-lg flex justify-between mb-4 cursor-pointer"
            >
                <div>
                    <div class="flex items-center mb-2">
                        {#if isSelected(answer?.value)}
                            <Icon width=16 height=16 icon="checkbox-round" classes="text-blue-500 mr-2"></Icon>
                        {/if}
                        <Text type="p" classes="uppercase text-blue-500" overrideColor smaller bold>{getAnswerHeader(answer?.value)}</Text>
                    </div>
                    <Text type="h3" classes="mb-2">{answer?.text}</Text>
                    <Text type="p">{answer?.additionalInfo}</Text>
                </div>
                <div class="my-auto">
                    <Icon icon="chevron-right" />
                </div>
            </div>
        {/each}
    </DashboardPane>
    <DashboardPane classes="w-full h-1/3 flex flex-row flex-shrink-0 space-y-3 overflow-hidden p-6">
        <div class="space-y-3">
            <Text type="p" smaller>My voting power</Text>
            <Text type="h1" classes="inline-flex items-end">4528 <Text type="h4" classes="ml-1 mb-1">votes</Text></Text>
            <Text type="p" smaller>My max voting power</Text>
            <Text type="h1" classes="inline-flex items-end">195609600 <Text type="h4" classes="ml-1 mb-1">votes</Text></Text>
        </div>
        <Icon icon="info" classes="ml-auto mt-0" />
    </DashboardPane>
</div>
