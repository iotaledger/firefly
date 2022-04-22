<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Icon, Spinner, Text } from 'shared/components'
    import { ledgerDeviceState, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { currentAccountTreasuryVoteValue } from 'shared/lib/participation/account'
    import { participate, stopParticipating } from 'shared/lib/participation/api'
    import {
        isParticipationPending,
        participationOverview,
        pendingParticipations,
    } from 'shared/lib/participation/stores'
    import { ParticipationAction, TrackedParticipationItem, VotingEventAnswer } from 'shared/lib/participation/types'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { sleep } from 'shared/lib/utils'
    import { isSyncing, selectedAccount } from 'shared/lib/wallet'
    import { onMount } from 'svelte'

    export let nextVote: VotingEventAnswer
    export let eventId: string
    export let shouldCastVoteOnMount: boolean = false

    enum VotingAction {
        Cast = 'castVotes',
        Merge = 'mergeVotes',
        Stop = 'stopVotes',
        Change = 'changeVotes',
    }

    let votingAction = VotingAction.Cast
    let isVoting = false
    let successText = localize('popups.votingConfirmation.votesSubmitted')
    let spinnerText = localize('general.syncing')

    let pendingParticipationIds: string[] = []
    let previousPendingParticipationsLength = 0

    $: showAdditionalInfo = votingAction === VotingAction.Change || votingAction === VotingAction.Stop
    $: disabled = isVoting || $isSyncing || $pendingParticipations?.length !== 0
    $: disabled, setSpinnerMessage()
    $: $currentAccountTreasuryVoteValue, nextVote, setVotingAction()

    onMount(() => {
        if (shouldCastVoteOnMount) {
            castVote()
        }

        const usubscribe = pendingParticipations.subscribe((participations) => {
            const currentParticipationsLength = participations.length

            if (currentParticipationsLength < previousPendingParticipationsLength) {
                const latestParticipationIds = participations.map((participation) => participation.messageId)

                if (latestParticipationIds.length === 0) {
                    openPopup(
                        {
                            type: 'success',
                            props: {
                                successText,
                            },
                        },
                        true
                    )
                }
                pendingParticipationIds = latestParticipationIds
                previousPendingParticipationsLength = currentParticipationsLength
                isVoting = false
            }
        })

        return () => {
            usubscribe()
        }
    })

    function displayErrorNotification(error): void {
        showAppNotification({
            type: 'error',
            message: localize(error.error),
        })
    }

    function setVotingAction(): void {
        if (!$currentAccountTreasuryVoteValue) {
            votingAction = VotingAction.Cast
        } else if ($currentAccountTreasuryVoteValue !== nextVote.value) {
            votingAction = VotingAction.Change
        } else if (hasReceivedFundsSinceLastVote()) {
            votingAction = VotingAction.Merge
        } else {
            votingAction = VotingAction.Stop
        }
    }

    function hasReceivedFundsSinceLastVote(): boolean {
        const { trackedParticipations } =
            $participationOverview?.find(({ accountIndex }) => accountIndex === $selectedAccount?.index) ?? {}
        const currentParticipation = trackedParticipations?.[eventId]?.slice(-1)?.[0] as TrackedParticipationItem
        const { amount } = currentParticipation ?? {}
        return amount !== $selectedAccount.rawIotaBalance
    }

    function castVote(): void {
        isVoting = true
        try {
            void vote()
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
            isVoting = false
        }
    }

    async function vote(): Promise<void> {
        switch (votingAction) {
            case VotingAction.Cast:
            case VotingAction.Merge:
                successText = localize('popups.votingConfirmation.votesSubmitted')
                await participate(
                    $selectedAccount?.id,
                    [{ eventId, answers: [nextVote?.value] }],
                    ParticipationAction.Vote
                )
                    .then((messageIds) => syncMessages(messageIds))
                    .catch((err) => {
                        console.error(err)
                        displayErrorNotification(err)
                    })
                break
            case VotingAction.Change:
                successText = localize('popups.votingConfirmation.votesSubmitted')
                await changeVote()
                break
            case VotingAction.Stop:
                successText = localize('popups.votingConfirmation.votesStopped')
                await stopParticipating($selectedAccount?.id, [eventId], ParticipationAction.Unvote)
                    .then((messageIds) => syncMessages(messageIds))
                    .catch((err) => {
                        console.error(err)
                        displayErrorNotification(err)
                    })
                break
            default:
                throw new Error('Unimplemented voting action!')
        }
    }

    async function changeVote(): Promise<void> {
        const [messageId] = await stopParticipating($selectedAccount?.id, [eventId], ParticipationAction.Unvote)
        while (isParticipationPending(messageId)) {
            await sleep(2000)
        }
        await participate($selectedAccount?.id, [{ eventId, answers: [nextVote?.value] }], ParticipationAction.Vote)
            .then((messageIds) => syncMessages(messageIds))
            .catch((err) => {
                console.error(err)
                displayErrorNotification(err)
            })
    }

    function syncMessages(messageIds: string[]): void {
        messageIds.forEach((id) => pendingParticipationIds.push(id))
        previousPendingParticipationsLength = messageIds.length
    }

    function handleStopClick(): void {
        votingAction = VotingAction.Stop
        handleCastClick()
    }

    function handleCastClick(): void {
        const openGovernanceManager = (): void => {
            openPopup(
                {
                    type: 'governanceManager',
                    props: {
                        nextVote,
                        eventId,
                        shouldCastVoteOnMount: true,
                    },
                },
                true
            )
        }

        if ($isSoftwareProfile) {
            if ($isStrongholdLocked) {
                checkStronghold(openGovernanceManager)
            } else {
                castVote()
            }
        } else {
            if ($ledgerDeviceState !== LedgerDeviceState.Connected) {
                showAppNotification({
                    type: 'warning',
                    message: localize('error.ledger.appNotOpen'),
                })
            } else {
                promptUserToConnectLedger(false, () => openGovernanceManager(), undefined, true)
            }
        }
    }

    function setSpinnerMessage(): void {
        if ($isSyncing || $pendingParticipations.length !== 0) {
            spinnerText = localize('general.syncing')
        } else {
            spinnerText = localize('general.broadcasting')
        }
    }
</script>

<div>
    <Text type="h3" classes="mb-8">{nextVote?.text}</Text>
    <Text type="p" classes="mb-5">{nextVote?.additionalInfo}</Text>
    {#if showAdditionalInfo}
        <div class="flex items-center mb-6 bg-blue-100 dark:bg-gray-800 rounded-xl p-3">
            <Icon icon="info" classes="text-gray-500 font-bold" />
            <Text type="p" classes="px-3">{localize('popups.votingConfirmation.additionalInfo')}</Text>
        </div>
    {/if}
    <div class="flex justify-between space-x-2">
        <Button onClick={closePopup} secondary classes="mb-0 w-full block text-15">{localize('actions.cancel')}</Button>
        <Button onClick={handleCastClick} {disabled} classes="mb-0 w-full block text-15">
            {#if disabled}
                <Spinner busy message={spinnerText} classes="mx-2 justify-center" />
            {:else}{localize(`actions.${votingAction}`)}{/if}
        </Button>
        {#if votingAction === `${VotingAction.Merge}`}
            <Button onClick={handleStopClick} {disabled} classes="mb-0 w-full block text-15">
                {#if disabled}
                    <Spinner busy message={spinnerText} classes="mx-2 justify-center" />
                {:else}{localize(`actions.${VotingAction.Stop}`)}{/if}
            </Button>
        {/if}
    </div>
</div>
