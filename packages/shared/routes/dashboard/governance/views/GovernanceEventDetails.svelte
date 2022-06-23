<script lang="typescript">
    import { ParticipationEvent, ParticipationEventState, VotingEventAnswer } from '@lib/participation/types'
    import { closePopup, openPopup } from '@lib/popup'
    import { isSoftwareProfile } from '@lib/profile'
    import { TransferProgressEventData, TransferProgressEventType, TransferState } from '@lib/typings/events'
    import { handleTransactionEventData, transferState } from '@lib/wallet'
    import { DashboardPane } from 'shared/components'
    import { participationAction } from 'shared/lib/participation/stores'
    import { ParticipationAction } from 'shared/lib/participation/types'
    import { popupState } from 'shared/lib/popup'
    import { GovernanceEventInfo, GovernanceEventResults, GovernanceEventStats } from './'

    export let event: ParticipationEvent

    let transactionEventData: TransferProgressEventData = null
    let nextVote: VotingEventAnswer = null
    let ledgerAwaitingConfirmation = false

    $: $transferState, handleLedgerTransferState()
    $: if (!$participationAction && ledgerAwaitingConfirmation && $popupState.type === 'ledgerTransaction') {
        closePopup(true)
    }

    const handleLedgerTransferState = (): void => !$isSoftwareProfile && handleTransferState($transferState)

    function handleTransferState(state: TransferState): void {
        if (!state) {
            return
        }

        const _onCancel = () => {
            transferState.set(null)
            closePopup(true)
        }

        const { data, type } = state

        switch (type) {
            // If a user presses "Accept" on ledger, this is the next transfer progress item.
            case TransferProgressEventType.PerformingPoW:
                // Close the current pop up i.e., the one with ledger transaction details
                closePopup(true)
                // Re-open the governance manager pop up if you are in the voting tab
                if (
                    $participationAction === ParticipationAction.Vote ||
                    $participationAction === ParticipationAction.Unvote
                ) {
                    openPopup(
                        {
                            type: 'governanceManager',
                            props: {
                                eventId: event?.eventId,
                                nextVote,
                            },
                        },
                        true
                    )
                }

                break
            case TransferProgressEventType.SigningTransaction:
                ledgerAwaitingConfirmation = true
                openPopup(
                    {
                        type: 'ledgerTransaction',
                        hideClose: true,
                        preventClose: true,
                        props: {
                            ...handleTransactionEventData(transactionEventData),
                            onCancel: _onCancel,
                        },
                    },
                    true
                )
                break
            case TransferProgressEventType.PreparedTransaction:
                transactionEventData = data
                break
            default:
                break
        }
    }
</script>

<div class="w-full h-full flex flex-col flex-nowrap flex-1 bg-gray-50 dark:bg-gray-900">
    <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
        <DashboardPane classes="w-full h-full col-span-2">
            <GovernanceEventInfo {event} bind:nextVote />
        </DashboardPane>
        <div class="h-full flex flex-col space-y-3 min-h-0">
            <DashboardPane classes="w-full flex-shrink-0">
                <GovernanceEventStats {event} />
            </DashboardPane>
            {#if event?.status?.status === ParticipationEventState.Holding || event?.status?.status === ParticipationEventState.Ended}
                <DashboardPane classes="w-full flex-grow">
                    <GovernanceEventResults {event} />
                </DashboardPane>
            {/if}
        </div>
    </div>
</div>
