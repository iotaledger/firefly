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

    const getAnswerHeader = (castedAnswerValue: string, answerValue: string): string => {
        if (isSelected(castedAnswerValue, answerValue)) {
            return setActiveText()
        } else if (castedAnswerValue) {
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

<div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
    <DashboardPane classes="w-full h-full p-6 col-span-2 flex flex-col">
        <Text type="p" classes="mr-auto px-2 py-1 mb-2 text-blue-500 bg-blue-100 rounded-lg" smaller bold overrideColor>{localize(`views.governance.events.status.${event?.status?.status}`)}</Text>
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
    <DashboardPane classes="w-full h-1/3 flex flex-row flex-shrink-0 overflow-hidden p-6">
        <div class="space-y-3">
            <Text type="p" smaller>{localize('views.governance.votingPower.title')}</Text>
            <Text type="h2" classes="inline-flex items-end">{account?.balance}</Text>
            <Text type="p" smaller>Voting opens on</Text>
            <Text type="h2" classes="inline-flex items-end">Sat, 23rd Feb, 13:00 CET</Text>
            <Text type="p" smaller>Counting starts on</Text>
            <Text type="h2" classes="inline-flex items-end">Sat, 4th Mar, 13:00 CET</Text>
        </div>
        <Icon icon="info-filled" classes="ml-auto mt-0 text-gray-400" />
    </DashboardPane>
</div>
