<script lang="typescript">
    import { onMount } from 'svelte';
    import { Button, Icon, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { closePopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile';
    import { selectedAccountId, api } from 'shared/lib/wallet';
    import { participate, participateWithRemainingFunds, stopParticipating } from 'shared/lib/participation/api';
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { isParticipationPending, participationOverview } from 'shared/lib/participation/stores';
    import { ParticipationAction, VotingEventAnswer } from 'shared/lib/participation/types';
    import { sleep } from 'shared/lib/utils';
    
    export let answer: VotingEventAnswer
    export let eventId: string
    
    enum VotingAction {
        Cast = 'castVotes',
        Merge = 'mergeVotes',
        Stop = 'stopVotes',
        Change = 'changeVotes'
    }

    let votingAction = VotingAction.Cast
    let disabled = false
    let successText = localize('popups.votingConfirmation.votesSubmitted')

    $: showAdditionalInfo = (votingAction === VotingAction.Change || votingAction === VotingAction.Stop)

    onMount(() => {
        setVotingAction()
    })

    const setVotingAction = (): void => {
        const overview = $participationOverview[0];
        const participation = overview?.participations.find(
            (participation) => participation.eventId === eventId
        )
        const answerValue = participation?.answers[0] ?? null
        if (!answerValue) {
            votingAction = VotingAction.Cast
        } else if (answerValue !== answer.value) {
            votingAction = VotingAction.Change
        } else {
            votingAction = VotingAction.Merge
        }
    }

    const castVote = async (): Promise<void> => {
        disabled = true
        try {
            await vote()
            openPopup({
                type: 'success',
                props: {
                    successText,
                }
            })
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
        }
        disabled = false
    }

    const vote = async (): Promise<void> => {
        switch (votingAction) {
            case VotingAction.Cast:
                await participate($selectedAccountId, [{ eventId, answers: [answer?.value] }], ParticipationAction.Vote)
                break
            case VotingAction.Merge:
                await participateWithRemainingFunds($selectedAccountId, [{ eventId, answers: [answer?.value] }], ParticipationAction.Vote)
                break
            case VotingAction.Change:
                await changeVote()
                break
            case VotingAction.Stop:
                await stopParticipating($selectedAccountId, [ eventId ], ParticipationAction.Unvote)
                break
            default:
                throw new Error('Unimplemented voting action!')
        }
    }

    const changeVote = async (): Promise<void> => {
        const [ messageId ] = await stopParticipating($selectedAccountId, [ eventId ], ParticipationAction.Unvote)
        while (isParticipationPending(messageId)) {
            await sleep(5000)
        }
        await participate($selectedAccountId, [{ eventId, answers: [answer?.value] }], ParticipationAction.Vote)
    }

    const handleStopClick = (): void => {
        votingAction = VotingAction.Stop;
        successText = localize('popups.votingConfirmation.votesStopped')
        handleCastClick()
    }

    const handleCastClick = (): void => {
        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({
                            type: 'password',
                            props: {
                                onSuccess: () => castVote(),
                            },
                        })
                    } else {
                        void castVote()
                    }
                },
                onError(err) {
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                },
            })
        } else {
            void castVote()
        }
    }
</script>

<div>
    <Text type="h3" classes="mb-8">{answer?.text}</Text>
    <Text type="p" classes="mb-5">{answer?.additionalInfo}</Text>
    {#if showAdditionalInfo}
        <div class="flex items-center mb-6 bg-blue-100 rounded-xl p-3">
            <Icon icon="info" classes="text-gray-500 font-bold"></Icon>
            <Text type="p" classes="px-3">{localize('popups.votingConfirmation.additionalInfo')}</Text>
        </div>
    {/if}
    <div class="flex justify-between space-x-2">
        <Button onClick={closePopup} secondary classes="mb-0 w-full block text-15">{localize('actions.cancel')}</Button>
        <Button onClick={handleCastClick} {disabled} classes="mb-0 w-full block text-15">{localize(`actions.${votingAction}`)}</Button>
        {#if votingAction === `${VotingAction.Merge}`}
            <Button onClick={handleStopClick} {disabled} classes="mb-0 w-full block text-15">{localize(`actions.${VotingAction.Stop}`)}</Button>
        {/if}
    </div>
</div>
