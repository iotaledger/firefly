<script lang="typescript">
    import { localize } from '@core/i18n'
    import { canParticipate, getAccountParticipationAbility } from '@lib/participation'
    import {
        currentAccountTreasuryVotePartiallyUnvotedAmount,
        currentAccountTreasuryVoteValue,
        hasCurrentAccountReceivedFundsSinceLastTreasuryVote,
    } from '@lib/participation/account'
    import {
        AccountParticipationAbility,
        ParticipationEvent,
        ParticipationEventState,
        VotingEventAnswer,
    } from '@lib/participation/types'
    import { openPopup } from '@lib/popup'
    import { formatUnitBestMatch } from '@lib/units'
    import { selectedAccountStore } from '@lib/wallet'
    import { DashboardPane, GovernanceInfoTooltip, Icon, Spinner, Text, Tooltip } from 'shared/components'
    import { addLinkHtmlTagsToPlainText } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        isChangingParticipation,
        participationAction,
        pendingParticipations,
    } from 'shared/lib/participation/stores'
    import { ParticipationAction } from 'shared/lib/participation/types'
    import { Platform } from 'shared/lib/platform'
    import { isSyncing } from 'shared/lib/wallet'
    import { onMount } from 'svelte'

    export let event: ParticipationEvent
    export let nextVote: VotingEventAnswer = null

    const tooltip = {
        statusTimeline: { anchor: null as HTMLElement, show: false },
        partiallyVoted: { anchor: null as HTMLElement, show: false },
    }

    $: eventAnswers = event?.information?.payload?.questions[0]?.answers ?? []
    $: results = event?.status?.questions?.[0]?.answers?.filter(
        (answer) => answer?.value !== 0 && answer?.value !== 255
    )
    $: cannotVote = getAccountParticipationAbility($selectedAccountStore) === AccountParticipationAbility.HasDustAmount
    $: disableVoting =
        $isChangingParticipation || $pendingParticipations?.length > 0 || !!$participationAction || $isSyncing

    $: eventAdditionalInfo = addLinkHtmlTagsToPlainText(
        event?.information?.additionalInfo,
        'cursor-pointer text-blue-500'
    )
    $: eventQuestionsInfo = addLinkHtmlTagsToPlainText(
        event?.information?.payload?.questions[0]?.text,
        'cursor-pointer text-blue-500'
    )

    let disableVotingMessages: {
        show?: boolean
        busy?: boolean
        message?: string
    }[]
    $: disableVoting,
        eventAnswers,
        $isSyncing,
        $currentAccountTreasuryVoteValue,
        $pendingParticipations,
        updateDisableVotingMessages()

    const isSelected = (castedAnswerValue: string, answerValue: string): boolean => castedAnswerValue === answerValue

    function handleAnswerClick(_nextVote: VotingEventAnswer): void {
        if (cannotVote) {
            showAppNotification({
                type: 'warning',
                message: localize('warning.participation.noFunds'),
            })

            return
        }
        nextVote = _nextVote
        openPopup({
            type: 'governanceManager',
            props: {
                eventId: event?.eventId,
                nextVote,
            },
        })
    }
    function getAnswerHeader(castedAnswerValue: string, answerValue: string): string {
        if (isWinnerAnswer(answerValue)) {
            return localize('views.governance.eventDetails.answerHeader.winner')
        } else if (isSelected(castedAnswerValue, answerValue)) {
            return setActiveText()
        } else if (castedAnswerValue) {
            return localize('views.governance.eventDetails.answerHeader.notSelected')
        } else {
            return `${localize('general.option')} ${answerValue}`
        }
    }
    function setActiveText(): string {
        if (event?.status?.status === ParticipationEventState.Holding) {
            return localize('views.governance.eventDetails.answerHeader.activeVoting')
        }
        return localize('views.governance.eventDetails.answerHeader.selected')
    }
    function isWinnerAnswer(answerValue: string): boolean {
        if (event?.status?.status === ParticipationEventState.Ended && results?.length) {
            const resultsAccumulated = results.map((result) => result?.accumulated)
            const max = Math.max(...resultsAccumulated)
            const indexOfMax = resultsAccumulated.indexOf(max)
            return answerValue == results[indexOfMax]?.value.toString()
        }
        return false
    }
    function toggleTooltip(type: string, show: boolean): void {
        switch (type) {
            case 'statusTimeline':
                tooltip.statusTimeline.show = show
                break
            case 'partiallyVoted':
                tooltip.partiallyVoted.show = show
                break
            default:
                break
        }
    }

    function updateDisableVotingMessages(): void {
        if (!disableVoting) return
        else {
            disableVotingMessages = []
            const pendingParticipation = $pendingParticipations?.[0]
            eventAnswers.forEach((eventAnswer) => {
                if ($isSyncing) {
                    disableVotingMessages.push({
                        show: true,
                        busy: true,
                        message: localize('general.syncing'),
                    })
                } else if (
                    $participationAction === ParticipationAction.Stake ||
                    $participationAction === ParticipationAction.Unstake
                ) {
                    const locale =
                        $participationAction === ParticipationAction.Stake ? 'general.staking' : 'general.unstaking'
                    disableVotingMessages.push({
                        show: true,
                        busy: true,
                        message: localize(locale),
                    })
                } else if (
                    pendingParticipation?.action === ParticipationAction.Vote ||
                    pendingParticipation?.action === ParticipationAction.Unvote
                ) {
                    const pendingParticipationAnswers =
                        pendingParticipation?.participations?.map((participations) => participations?.answers) ?? []
                    if (pendingParticipation?.action === ParticipationAction.Vote) {
                        if (
                            pendingParticipationAnswers.some((participation) =>
                                participation.includes(eventAnswer?.value)
                            )
                        ) {
                            disableVotingMessages.push({
                                show: true,
                                busy: true,
                                message: localize('general.voting'),
                            })
                        } else {
                            disableVotingMessages.push({
                                show: false,
                            })
                        }
                    } else {
                        if (isSelected($currentAccountTreasuryVoteValue, eventAnswer?.value)) {
                            disableVotingMessages.push({
                                show: true,
                                busy: true,
                                message: localize('general.unvoting'),
                            })
                        } else {
                            disableVotingMessages.push({
                                show: false,
                            })
                        }
                    }
                }
            })
            disableVotingMessages = disableVotingMessages
        }
    }

    // We need to add event listeners to all links from plain text to make them work
    onMount(() => {
        const linksFromPlainText = document.querySelectorAll('.link-from-plaintext')
        const onLinkClick = (e: MouseEvent) => {
            e.preventDefault()
            const href = (e.target as HTMLElement).getAttribute('href')
            if (href) {
                Platform.openUrl(href)
            }
        }
        linksFromPlainText?.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const href = link.getAttribute('href')
                if (href) {
                    window.open(href, '_blank')
                }
            })
        })
        return () => linksFromPlainText?.forEach((link) => link.removeEventListener('click', onLinkClick))
    })
</script>

<DashboardPane classes="w-full h-full p-6 col-span-2 row-span-2 flex flex-col">
    <div class="flex flex-start items-center mb-2">
        <Text
            type="p"
            classes="px-2 py-1 text-blue-500 bg-blue-100 dark:bg-gray-900 rounded-lg"
            smaller
            bold
            overrideColor
        >
            {localize(`views.governance.events.status.${event?.status?.status}`)}
        </Text>
        <button
            on:mouseenter={() => toggleTooltip('statusTimeline', true)}
            on:mouseleave={() => toggleTooltip('statusTimeline', false)}
            bind:this={tooltip.statusTimeline.anchor}
        >
            <Icon icon="info-filled" classes="ml-2 text-gray-400" />
        </button>
        {#if tooltip.statusTimeline.show}
            <GovernanceInfoTooltip
                {event}
                type="statusTimeline"
                anchor={tooltip.statusTimeline.anchor}
                position="right"
            />
        {/if}
    </div>
    <div class="flex flex-col space-y-4 mb-6">
        <Text type="h2">{event?.information?.name}</Text>
        {#if eventAdditionalInfo}
            <Text type="p" overrideColor classes="text-gray-700 dark:text-gray-500">
                {@html eventAdditionalInfo}
            </Text>
        {/if}
        {#if eventQuestionsInfo}
            <Text type="h3" overrideColor classes="text-gray-900 dark:text-white">
                {@html eventQuestionsInfo}
            </Text>
        {/if}
    </div>
    <div class="flex flex-col w-full space-y-16 overflow-y-auto flex-auto h-1 space-y-2.5 -mr-2 pr-2 scroll-secondary">
        {#each event?.information?.payload?.questions[0]?.answers ?? [] as answer, answerIndex}
            <button
                on:click={() => handleAnswerClick(answer)}
                class:winner={isWinnerAnswer(answer?.value)}
                class:active={isSelected($currentAccountTreasuryVoteValue, answer?.value)}
                class:partial={isSelected($currentAccountTreasuryVoteValue, answer?.value) &&
                    $hasCurrentAccountReceivedFundsSinceLastTreasuryVote}
                disabled={disableVoting || !canParticipate(event?.status?.status)}
                class="relative py-5 px-6 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 hover:bg-gray-100 dark:hover:bg-gray-900 dark:hover:bg-opaciity-100 rounded-xl border border-solid border-gray-200 dark:border-transparent"
            >
                <div class="flex justify-between w-full items-center">
                    <div class="flex flex-col mr-12">
                        <div class="flex items-center mb-2">
                            {#if isSelected($currentAccountTreasuryVoteValue, answer?.value) || isWinnerAnswer(answer?.value)}
                                {#if event?.status?.status === ParticipationEventState.Holding}
                                    <span class="relative flex justify-center items-center h-3 w-3 mr-2">
                                        <span
                                            class="pulse absolute inline-flex h-full w-full rounded-full bg-blue-400
                                        opacity-75"
                                        />
                                        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                                    </span>
                                {:else}
                                    <Icon
                                        width="16"
                                        height="16"
                                        icon="status-success"
                                        classes="{isWinnerAnswer(answer?.value)
                                            ? 'text-blue-500 bg-white'
                                            : 'bg-blue-500 text-white'} rounded-full mr-2"
                                    />
                                {/if}
                            {/if}
                            <Text
                                type="p"
                                classes="uppercase text-blue-500 {$currentAccountTreasuryVoteValue &&
                                !isSelected($currentAccountTreasuryVoteValue, answer?.value)
                                    ? 'text-gray-500'
                                    : ''}
                            {isWinnerAnswer(answer?.value) ? 'text-white' : ''}"
                                overrideColor
                                smaller
                                bold
                            >
                                {getAnswerHeader($currentAccountTreasuryVoteValue, answer?.value)}
                            </Text>
                        </div>
                        <Text
                            type="h3"
                            classes="mb-2 text-left {isWinnerAnswer(answer?.value)
                                ? 'text-white'
                                : 'text-gray-800 dark:text-white'}"
                            overrideColor
                        >
                            {answer?.text}
                        </Text>
                        <Text
                            type="p"
                            classes="text-left max-h-32 overflow-auto {isWinnerAnswer(answer?.value)
                                ? 'text-white dark:text-white'
                                : 'text-gray-700 dark:text-gray-500'}"
                            overrideColor
                        >
                            {answer?.additionalInfo}
                        </Text>
                    </div>
                    {#if canParticipate(event?.status?.status)}
                        {#if disableVoting}
                            {#if disableVotingMessages?.[answerIndex]?.show}
                                <div class="p-2 bg-gray-300 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                    <Spinner
                                        busy={disableVotingMessages?.[answerIndex]?.busy}
                                        message={disableVotingMessages?.[answerIndex]?.message}
                                        classes="mx-2 justify-center"
                                    />
                                </div>
                            {/if}
                        {:else if isSelected($currentAccountTreasuryVoteValue, answer?.value) && $hasCurrentAccountReceivedFundsSinceLastTreasuryVote}
                            <div class="flex flex-row space-x-2 items-center flex-shrink-0">
                                <Text type="p" overrideColor classes="text-yellow-600"
                                    >{localize('views.governance.manageVote')}</Text
                                >
                                <div
                                    bind:this={tooltip.partiallyVoted.anchor}
                                    on:mouseenter={() => toggleTooltip('partiallyVoted', true)}
                                    on:mouseleave={() => toggleTooltip('partiallyVoted', false)}
                                    class=""
                                >
                                    <Icon width="18" height="18" icon="exclamation" classes="text-yellow-600" />
                                </div>
                            </div>
                            {#if tooltip.partiallyVoted.show}
                                <Tooltip anchor={tooltip.partiallyVoted.anchor} position="right">
                                    <Text type="p" classes="text-gray-900 bold mb-1 text-left">
                                        {localize('views.governance.info.tooltip.partiallyVoted.title', {
                                            values: {
                                                amount: formatUnitBestMatch(
                                                    $currentAccountTreasuryVotePartiallyUnvotedAmount
                                                ),
                                            },
                                        })}
                                    </Text>
                                    <Text type="p" secondary classes="text-left">
                                        {localize('views.governance.info.tooltip.partiallyVoted.body', {
                                            values: { account: $selectedAccountStore?.alias },
                                        })}
                                    </Text>
                                </Tooltip>
                            {/if}
                        {:else}
                            <div class="flex flex-row space-x-2 items-center flex-shrink-0">
                                {#if !$currentAccountTreasuryVoteValue}
                                    <Text type="p" highlighted>{localize('actions.castVotes')}</Text>
                                {/if}
                                <Icon icon="chevron-right" classes="text-blue-500" />
                            </div>
                        {/if}
                    {/if}
                </div>
            </button>
        {/each}
    </div>
</DashboardPane>

<style type="text/scss">
    button {
        &.active:not(.partial):not(.winner) {
            @apply border-blue-500;
            @apply bg-blue-500;
            @apply bg-opacity-10;
            &:hover {
                @apply border-blue-500;
                @apply bg-blue-500;
                @apply bg-opacity-20;
            }
        }
        &:disabled {
            @apply pointer-events-none;
            &:not(.winner) {
                @apply opacity-50;
            }
        }
        &.partial {
            @apply border-yellow-600;
        }
        &.winner {
            @apply bg-blue-500;
            @apply border-blue-500;
        }
    }
    .pulse {
        animation: -ping 2500ms cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    @keyframes -ping {
        30%,
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }
</style>
