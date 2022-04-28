<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Icon, Spinner, Text } from 'shared/components'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { hasNodePlugin } from 'shared/lib/networkStatus'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        currentAccountTreasuryVotePartiallyUnvotedAmount,
        currentAccountTreasuryVoteValue,
        hasCurrentAccountReceivedFundsSinceLastTreasuryVote,
    } from 'shared/lib/participation/account'
    import { participate, stopParticipating } from 'shared/lib/participation/api'
    import {
        isParticipationPending,
        isPerformingParticipation,
        participationAction,
        pendingParticipations,
    } from 'shared/lib/participation/stores'
    import { ParticipationAction, VotingEventAnswer } from 'shared/lib/participation/types'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { sleep } from 'shared/lib/utils'
    import { isSyncing, selectedAccount, transferState } from 'shared/lib/wallet'
    import { onMount } from 'svelte'

    export let nextVote: VotingEventAnswer
    export let eventId: string
    export let shouldCastVoteOnMount: boolean = false
    export let votingAction: VotingAction

    enum VotingAction {
        Cast = 'castVotes',
        Merge = 'mergeVotes',
        Stop = 'stopVotes',
        Change = 'changeVotes',
    }

    let isVoting = false

    let pendingParticipationIds: string[] = []
    let previousPendingParticipationsLength = 0

    $: loading = isVoting || $isSyncing || $pendingParticipations?.length !== 0
    $: isVotingNextVote = $currentAccountTreasuryVoteValue === nextVote.value
    $: canMergeVotes = isVotingNextVote && $hasCurrentAccountReceivedFundsSinceLastTreasuryVote

    // Note: this async is needed here to persist the subscription to pendingParticipations and reset the view accordingly
    /* eslint-disable @typescript-eslint/require-await */
    onMount(async () => {
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

        const usubscribe = pendingParticipations.subscribe((participations) => {
            const currentParticipationsLength = participations.length

            if (currentParticipationsLength < previousPendingParticipationsLength) {
                const latestParticipationIds = participations.map((participation) => participation.messageId)

                if (latestParticipationIds.length === 0) {
                    resetView()
                }

                pendingParticipationIds = latestParticipationIds
                previousPendingParticipationsLength = currentParticipationsLength
            }
        })

        return () => {
            usubscribe()
        }
    })
    /* eslint-enable @typescript-eslint/no-unused-vars */

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
                    $selectedAccount?.id,
                    [{ eventId, answers: [nextVote?.value] }],
                    ParticipationAction.Vote
                )
                    .then((messageIds) => syncParticipations(messageIds))
                    .catch((err) => {
                        console.error(err)
                        displayErrorNotification(err)
                        resetView()
                    })
                break
            case VotingAction.Change:
                await changeVote()
                break
            case VotingAction.Stop:
                $participationAction = ParticipationAction.Unvote
                await stopParticipating($selectedAccount?.id, [eventId], ParticipationAction.Unvote)
                    .then((messageIds) => syncParticipations(messageIds))
                    .catch((err) => {
                        console.error(err)
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
        await stopParticipating($selectedAccount?.id, [eventId], ParticipationAction.Unvote)
            .then(async (messageIds) => {
                syncParticipations(messageIds)
                const [messageId] = messageIds
                while (isParticipationPending(messageId)) {
                    await sleep(2000)
                }
                $participationAction = ParticipationAction.Vote
                await participate(
                    $selectedAccount?.id,
                    [{ eventId, answers: [nextVote?.value] }],
                    ParticipationAction.Vote
                )
                    .then((messageIds) => syncParticipations(messageIds))
                    .catch((err) => {
                        console.error(err)
                        displayErrorNotification(err)
                        resetView()
                    })
            })
            .catch((err) => {
                console.error(err)
                displayErrorNotification(err)
                resetView()
            })
    }

    function syncParticipations(messageIds: string[]): void {
        messageIds.forEach((id) => pendingParticipationIds.push(id))
        previousPendingParticipationsLength = messageIds.length
    }
</script>

<div>
    <Text type="h3" classes="mb-6">{nextVote?.text}</Text>
    <Text type="p" classes="mb-6">{nextVote?.additionalInfo}</Text>
    {#if loading}
        <Button disabled classes="mb-0 w-full block text-15">
            <Spinner
                busy
                message={$isSyncing ? localize('general.syncing') : undefined}
                classes="mx-2 justify-center"
            />
        </Button>
    {:else}
        {#if $currentAccountTreasuryVoteValue}
            <div class="flex items-center mb-6 bg-blue-100 dark:bg-gray-800 rounded-xl p-3">
                <Icon icon="info" classes="text-gray-500 font-bold" />
                <Text type="p" classes="px-3"
                    >{localize(
                        `popups.votingConfirmation.additionalInfo${
                            $currentAccountTreasuryVoteValue !== nextVote.value ? 'Changing' : 'Stopping'
                        }`
                    )}</Text
                >
            </div>
        {/if}
        {#if canMergeVotes}
            <div class="mb-6 flex flex-col flex-wrap space-y-3 bg-blue-100 dark:bg-gray-800 rounded-xl p-6">
                <Text type="p">
                    {localize('popups.votingConfirmation.partiallyVoted', {
                        values: { account: $selectedAccount?.alias },
                    })}
                </Text>
                <Text type="p" bold>
                    {localize('popups.votingConfirmation.partiallyVotedAmount', {
                        values: { amount: formatUnitBestMatch($currentAccountTreasuryVotePartiallyUnvotedAmount) },
                    })}
                </Text>
            </div>
        {/if}
        <div class="flex justify-between space-x-4">
            {#if !$currentAccountTreasuryVoteValue}
                <Button onClick={() => handleActionClick(VotingAction.Cast)} classes="mb-0 w-full block text-15">
                    {localize(`actions.${VotingAction.Cast}`)}
                </Button>
            {:else}
                {#if isVotingNextVote}
                    <Button
                        secondary
                        onClick={() => handleActionClick(VotingAction.Stop)}
                        classes="mb-0 w-full block text-15"
                    >
                        {localize(`actions.${VotingAction.Stop}`)}
                    </Button>
                {/if}
                {#if canMergeVotes}
                    <Button
                        caution
                        onClick={() => handleActionClick(VotingAction.Merge)}
                        classes="mb-0 w-full block text-15"
                    >
                        {localize(`actions.${VotingAction.Merge}`)}
                    </Button>
                {:else if $currentAccountTreasuryVoteValue !== nextVote.value}
                    <Button onClick={() => handleActionClick(VotingAction.Change)} classes="mb-0 w-full block text-15">
                        {localize(`actions.${VotingAction.Change}`)}
                    </Button>
                {/if}
            {/if}
        </div>
    {/if}
</div>
