<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Icon, Illustration, Spinner, Text } from 'shared/components'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { hasNodePlugin } from 'shared/lib/networkStatus'
    import { showAppNotification } from 'shared/lib/notifications'
    import { stakedAmount } from 'shared/lib/participation'
    import {
        currentAccountTreasuryVotePartiallyUnvotedAmount,
        currentAccountTreasuryVoteValue,
        hasCurrentAccountReceivedFundsSinceLastTreasuryVote,
    } from 'shared/lib/participation/account'
    import { participate, stopParticipating } from 'shared/lib/participation/api'
    import {
        isChangingParticipation,
        isParticipationPending,
        isPerformingParticipation,
        participationAction,
        pendingParticipations,
    } from 'shared/lib/participation/stores'
    import { ParticipationAction, VotingAction, VotingEventAnswer } from 'shared/lib/participation/types'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { sleep } from 'shared/lib/utils'
    import { isSyncing, selectedAccountStore, transferState } from 'shared/lib/wallet'
    import { onMount } from 'svelte'

    // nextVote is the vote that the user has selected to vote for.
    export let nextVote: VotingEventAnswer
    export let eventId: string
    export let shouldCastVoteOnMount: boolean = false
    export let votingAction: VotingAction

    let isVoting = false

    let activeFlow: VotingAction
    const pendingParticipationIds: string[] = []
    let previousPendingParticipationsLength = 0
    let title = ''

    $: loading =
        isVoting ||
        $isSyncing ||
        $pendingParticipations?.length !== 0 ||
        !!$participationAction ||
        $isChangingParticipation
    $: isAlreadyVotingNextVote = $currentAccountTreasuryVoteValue === nextVote?.value
    $: canMergeVotes = isAlreadyVotingNextVote && $hasCurrentAccountReceivedFundsSinceLastTreasuryVote
    $: activeFlow, (title = getTitleText())

    onMount(() => {
        activeFlow = getActiveFlow()
        if (!hasNodePlugin(NodePlugin.Participation)) {
            showAppNotification({
                type: 'warning',
                message: localize('error.node.pluginNotAvailable', {
                    values: { nodePlugin: NodePlugin.Participation },
                }),
            })

            resetView()

            return
        }
        if (shouldCastVoteOnMount) {
            void castVote(votingAction)
        }

        const unsubscribe = pendingParticipations.subscribe((participations) => {
            if (participations?.length < previousPendingParticipationsLength && participations?.length === 0) {
                // Display confirmation popup on governance action success
                if (
                    $participationAction === ParticipationAction.Vote ||
                    $participationAction === ParticipationAction.Unvote
                ) {
                    if (
                        !$isChangingParticipation ||
                        ($isChangingParticipation && $participationAction === ParticipationAction.Vote)
                    ) {
                        openPopup({
                            type: 'success',
                            props: {
                                title: localize(`popups.governanceManager.successPopup.${activeFlow}Title`),
                                body: localize(
                                    `popups.governanceManager.successPopup.${
                                        activeFlow === VotingAction.Stop ? 'stop' : 'cast'
                                    }Body`,
                                    {
                                        values: {
                                            voteText: nextVote?.text,
                                            voteValue: nextVote?.value,
                                        },
                                    }
                                ),
                            },
                        })
                    }
                }
                resetView()
            }
            previousPendingParticipationsLength = participations?.length ?? 0
        })

        return () => {
            unsubscribe()
        }
    })

    function handleActionClick(action: VotingAction): void {
        votingAction = action
        const openGovernanceManager = () => {
            openPopup(
                {
                    type: 'governanceManager',
                    props: {
                        nextVote,
                        eventId,
                        shouldCastVoteOnMount: true,
                        votingAction,
                    },
                },
                true
            )
        }
        if ($isSoftwareProfile) {
            if ($isStrongholdLocked) {
                checkStronghold(openGovernanceManager)
            } else {
                void castVote(votingAction)
            }
        } else {
            if ($popupState?.active && $popupState?.type === 'governanceManager') {
                void castVote(votingAction)
            } else {
                promptUserToConnectLedger(false, () => openGovernanceManager(), undefined, true)
            }
        }
    }

    async function castVote(votingAction: VotingAction): Promise<void> {
        isVoting = true
        try {
            await vote(votingAction)
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
        }
        isVoting = false
    }

    function resetView(): void {
        if (!isSoftwareProfile) {
            transferState.set(null)
        }
        activeFlow = getActiveFlow()
        isPerformingParticipation.set(false)
        participationAction.set(undefined)
    }

    function displayErrorNotification(error): void {
        showAppNotification({
            type: 'error',
            message: localize(error.error),
        })
    }

    async function vote(_votingAction: VotingAction): Promise<void> {
        switch (_votingAction) {
            case VotingAction.Cast:
            case VotingAction.Merge:
                $participationAction = ParticipationAction.Vote
                await participate(
                    $selectedAccountStore?.id,
                    [{ eventId, answers: [nextVote?.value] }],
                    ParticipationAction.Vote
                )
                    .then((messageIds) => syncParticipations(messageIds))
                    .catch((err) => {
                        console.error(err)
                        isChangingParticipation.set(false)
                        displayErrorNotification(err)
                        resetView()
                    })
                break
            case VotingAction.Change:
                await changeVote()
                break
            case VotingAction.Stop:
                $participationAction = ParticipationAction.Unvote
                await stopParticipating($selectedAccountStore?.id, [eventId], ParticipationAction.Unvote)
                    .then((messageIds) => syncParticipations(messageIds))
                    .catch((err) => {
                        console.error(err)
                        isChangingParticipation.set(false)
                        displayErrorNotification(err)
                        resetView()
                    })
                break
            default:
                throw new Error('Unimplemented voting action!')
        }
    }

    async function changeVote(): Promise<void> {
        $participationAction = ParticipationAction.Unvote
        isChangingParticipation.set(true)
        await stopParticipating($selectedAccountStore?.id, [eventId], ParticipationAction.Unvote)
            .then(async (messageIds) => {
                syncParticipations(messageIds)
                const [messageId] = messageIds
                while (isParticipationPending(messageId)) {
                    await sleep(2000)
                }
                $participationAction = ParticipationAction.Vote
                await participate(
                    $selectedAccountStore?.id,
                    [{ eventId, answers: [nextVote?.value] }],
                    ParticipationAction.Vote
                )
                    .then((messageIds) => syncParticipations(messageIds))
                    .catch((err) => {
                        console.error(err)
                        isChangingParticipation.set(false)
                        displayErrorNotification(err)
                        resetView()
                    })
            })
            .catch((err) => {
                console.error(err)
                isChangingParticipation.set(false)
                displayErrorNotification(err)
                resetView()
            })
    }

    function syncParticipations(messageIds: string[]): void {
        messageIds.forEach((id) => pendingParticipationIds.push(id))
        previousPendingParticipationsLength = messageIds.length
    }

    function getTitleText(): string {
        switch (activeFlow) {
            case VotingAction.Cast:
                return localize('popups.governanceManager.castYourVote')
            case VotingAction.Stop:
                return localize('popups.governanceManager.stopVoting')
            case VotingAction.Change:
                return localize('popups.governanceManager.changeVote')
            case VotingAction.Merge:
                return localize('popups.governanceManager.manageVotes')
        }
    }

    function getActiveFlow(): VotingAction {
        let _activeFlow: VotingAction
        if ($isChangingParticipation) {
            _activeFlow = VotingAction.Change
        } else {
            if (!$currentAccountTreasuryVoteValue || votingAction === VotingAction.Cast) {
                _activeFlow = VotingAction.Cast
            } else if (isAlreadyVotingNextVote) {
                if (canMergeVotes || votingAction === VotingAction.Merge) {
                    _activeFlow = VotingAction.Merge
                } else if (!canMergeVotes || votingAction === VotingAction.Stop) {
                    _activeFlow = VotingAction.Stop
                }
            } else {
                _activeFlow = VotingAction.Change
            }
        }
        return _activeFlow
    }
</script>

<div>
    <Text type="h3" classes="mb-6">{title}</Text>
    {#if activeFlow === VotingAction.Cast}
        <div class="flex flex-col items-center text-center">
            <Illustration illustration="governance-info" classes="w-28 h-28 mb-6" />
            <Text type="p" classes="mb-8"
                >{localize('popups.governanceManager.castYourVoteInfo', {
                    values: {
                        amount: formatUnitBestMatch($selectedAccountStore?.rawIotaBalance, true, 3),
                        voteText: nextVote?.text,
                        voteValue: nextVote?.value,
                    },
                })}
            </Text>
            <Button disabled={loading} onClick={() => handleActionClick(VotingAction.Cast)} classes="w-full">
                {#if loading}
                    <Spinner
                        busy
                        message={$isSyncing
                            ? localize('general.syncing')
                            : localize('popups.governanceManager.castingVotes')}
                        classes="mx-2 justify-center"
                    />
                {:else}
                    {localize(`actions.${VotingAction.Cast}`)}
                {/if}
            </Button>
        </div>
    {:else if activeFlow === VotingAction.Stop || activeFlow === VotingAction.Change}
        <div class="flex flex-col">
            <Text type="p" classes="mb-4"
                >{localize(
                    `popups.governanceManager.${
                        activeFlow === VotingAction.Stop ? 'stopVotingInfo' : 'changeVoteInfo'
                    }`,
                    {
                        values: {
                            voteText: nextVote?.text,
                            voteValue: nextVote?.value,
                        },
                    }
                )}
            </Text>
            <div class="flex items-center mb-6 bg-blue-50 dark:bg-gray-800 rounded-xl p-4">
                <Icon icon="exclamation" classes="text-gray-500" />
                <Text type="p" classes="px-3">
                    {localize(
                        `popups.governanceManager.${
                            activeFlow === VotingAction.Stop ? 'stopVotingDisclaimer' : 'changeVoteDisclaimer'
                        }`
                    )}
                </Text>
            </div>
            <div class="flex flex-row justify-between space-x-4 w-full">
                <Button disabled={loading} secondary classes="w-1/2" onClick={() => closePopup()}>
                    {localize('actions.cancel')}
                </Button>
                <Button
                    warning
                    disabled={loading}
                    onClick={() =>
                        handleActionClick(activeFlow === VotingAction.Stop ? VotingAction.Stop : VotingAction.Change)}
                    classes="w-1/2"
                >
                    {#if loading}
                        <Spinner
                            busy
                            message={$isSyncing
                                ? localize('general.syncing')
                                : localize(
                                      `popups.governanceManager.${
                                          activeFlow === VotingAction.Stop ? 'stoppingVoting' : 'changingVote'
                                      }`
                                  )}
                            classes="mx-2 justify-center"
                        />
                    {:else}
                        {localize(
                            `actions.${activeFlow === VotingAction.Stop ? VotingAction.Stop : VotingAction.Change}`
                        )}
                    {/if}
                </Button>
            </div>
        </div>
    {:else if activeFlow === VotingAction.Merge}
        <div class="flex flex-col">
            <Text type="p" classes="mb-4"
                >{localize('popups.governanceManager.partialVoteInfo', {
                    values: {
                        amount: formatUnitBestMatch($currentAccountTreasuryVotePartiallyUnvotedAmount),
                        account: $selectedAccountStore?.alias,
                    },
                })}
            </Text>
            <div
                class="flex items-center {$stakedAmount > 0
                    ? 'mb-4'
                    : 'mb-6'} bg-blue-50 dark:bg-gray-800 rounded-xl p-4"
            >
                <Icon icon="exclamation" classes="text-gray-500" />
                <Text type="p" classes="px-3">
                    {localize('popups.governanceManager.mergeVoteDisclaimer')}
                </Text>
            </div>
            {#if $stakedAmount > 0}
                <div class="flex items-center mb-6 bg-blue-50 dark:bg-gray-800 rounded-xl p-4">
                    <Icon icon="exclamation" classes="text-gray-500" />
                    <Text type="p" classes="px-3">
                        {localize('popups.governanceManager.mergeVoteDisclaimerStaking')}
                    </Text>
                </div>
            {/if}
            <div class="flex flex-row justify-between space-x-4 w-full">
                <Button
                    disabled={loading}
                    secondary
                    classes="w-1/2"
                    onClick={() => {
                        activeFlow = VotingAction.Stop
                    }}
                >
                    <Text overrideColor classes="text-red-500 {loading ? 'opacity-50' : ''}"
                        >{localize(`actions.${VotingAction.Stop}`)}</Text
                    >
                </Button>
                <Button disabled={loading} onClick={() => handleActionClick(VotingAction.Merge)} classes="w-1/2">
                    {#if loading}
                        <Spinner
                            busy
                            message={$isSyncing
                                ? localize('general.syncing')
                                : localize('popups.governanceManager.mergingVotes')}
                            classes="mx-2 justify-center"
                        />
                    {:else}
                        {localize(`actions.${VotingAction.Merge}`)}
                    {/if}
                </Button>
            </div>
        </div>
    {/if}
</div>
