<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Icon, Spinner, Text } from 'shared/components'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { hasNodePlugin } from 'shared/lib/networkStatus'
    import { showAppNotification } from 'shared/lib/notifications'
    import { currentAccountTreasuryVoteValue } from 'shared/lib/participation/account'
    import { participate, stopParticipating } from 'shared/lib/participation/api'
    import {
        isParticipationPending,
        isPerformingParticipation,
        participationAction,
        participationOverview,
        pendingParticipations,
    } from 'shared/lib/participation/stores'
    import { ParticipationAction, TrackedParticipationItem, VotingEventAnswer } from 'shared/lib/participation/types'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { sleep } from 'shared/lib/utils'
    import { isSyncing, selectedAccount, transferState } from 'shared/lib/wallet'
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

    let showAdditionalInfo
    let votingAction = VotingAction.Cast
    let isVoting = false
    let spinnerText = localize('general.syncing')

    $: disabled = isVoting || $isSyncing || $pendingParticipations?.length !== 0
    $: disabled, setSpinnerMessage()
    $: $currentAccountTreasuryVoteValue, nextVote, setVotingAction()

    onMount(() => {
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
            void castVote()
        }
    })

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
        showAdditionalInfo = votingAction === VotingAction.Change || votingAction === VotingAction.Stop
    }

    function hasReceivedFundsSinceLastVote(): boolean {
        const { trackedParticipations } =
            $participationOverview?.find(({ accountIndex }) => accountIndex === $selectedAccount?.index) ?? {}
        const currentParticipation = trackedParticipations?.[eventId]?.slice(-1)?.[0] as TrackedParticipationItem
        const { amount } = currentParticipation ?? {}
        return amount !== $selectedAccount.rawIotaBalance
    }

    async function castVote(): Promise<void> {
        isVoting = true
        try {
            await vote()
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
        }
        isVoting = false
    }

    async function vote(): Promise<void> {
        switch (votingAction) {
            case VotingAction.Cast:
            case VotingAction.Merge:
                await participate(
                    $selectedAccount?.id,
                    [{ eventId, answers: [nextVote?.value] }],
                    ParticipationAction.Vote
                ).catch((err) => {
                    console.error(err)
                    displayErrorNotification(err)
                    resetView()
                })
                break
            case VotingAction.Change:
                await changeVote()
                break
            case VotingAction.Stop:
                await stopParticipating($selectedAccount?.id, [eventId], ParticipationAction.Unvote).catch((err) => {
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
        const [messageId] = await stopParticipating($selectedAccount?.id, [eventId], ParticipationAction.Unvote)
        while (isParticipationPending(messageId)) {
            await sleep(2000)
        }
        await participate(
            $selectedAccount?.id,
            [{ eventId, answers: [nextVote?.value] }],
            ParticipationAction.Vote
        ).catch((err) => {
            console.error(err)
            displayErrorNotification(err)
        })
    }

    function handleStopClick(): void {
        $participationAction = ParticipationAction.Unvote
        votingAction = VotingAction.Stop
        handleCastClick()
    }

    function handleCastClick(): void {
        $participationAction = ParticipationAction.Vote
        const openGovernanceManager = () => {
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
                void castVote()
            }
        } else {
            if ($popupState?.active && $popupState?.type === 'governanceManager') {
                void castVote()
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
            <Text type="p" classes="px-3"
                >{localize(
                    `popups.votingConfirmation.additionalInfo${
                        votingAction === VotingAction.Stop ? 'Stopping' : 'Changing'
                    }`
                )}</Text
            >
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
