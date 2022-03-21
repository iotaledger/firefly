<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { participationAction, stakingEventState } from 'shared/lib/participation/stores'
    import { ParticipationEventState, StakingAirdrop as _StakingAirdrop } from 'shared/lib/participation/types'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import {
        GeneratingRemainderDepositAddressEvent,
        PreparedTransactionEvent,
        TransactionEventData,
        TransferProgressEventData,
        TransferProgressEventType,
        TransferState,
    } from 'shared/lib/typings/events'
    import { transferState } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'
    import { getParticipationEvents, getParticipationOverview } from '../../../lib/participation/api'
    import { StakingAirdrop, StakingInfo, StakingSummary } from './views'

    const handleNewStakingFeature = (): void => {
        if (!$activeProfile?.hasVisitedStaking) {
            showAppNotification({
                type: 'info',
                message: localize('views.staking.welcome'),
            })

            updateProfile('hasVisitedStaking', true)
        }
    }

    // TODO: This is an exact copy of a method defined in Wallet.svelte. Need to move it to shared.
    const handleTransactionEventData = (eventData: TransferProgressEventData): TransactionEventData => {
        if (!eventData) return {}

        const remainderData = eventData as GeneratingRemainderDepositAddressEvent
        if (remainderData?.address) return { remainderAddress: remainderData?.address }

        const txData = eventData as PreparedTransactionEvent
        if (!(txData?.inputs && txData?.outputs) || txData?.inputs.length <= 0 || txData?.outputs.length <= 0) return {}

        const numOutputs = txData.outputs.length
        if (numOutputs === 1) {
            return {
                toAddress: txData.outputs[0].address,
                toAmount: txData.outputs[0].amount,
            }
        } else if (numOutputs > 1) {
            return {
                toAddress: txData.outputs[0].address,
                toAmount: txData.outputs[0].amount,

                remainderAddress: txData.outputs[numOutputs - 1].address,
                remainderAmount: txData.outputs[numOutputs - 1].amount,
            }
        } else {
            return txData
        }
    }

    let transactionEventData: TransferProgressEventData = null
    let ledgerAwaitingConfirmation = false

    const handleTransferState = (state: TransferState): void => {
        if (!state) return

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
                // Re-open the staking manager pop up
                openPopup({ type: 'stakingManager' }, true)
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

    $: if (!$participationAction && ledgerAwaitingConfirmation && $popupState.type === 'ledgerTransaction') {
        closePopup(true)
    }

    $: if ($popupState.type === 'stakingManager' && $stakingEventState === ParticipationEventState.Inactive) {
        closePopup(true)
    }

    onMount(async () => {
        if (!$activeProfile?.hasVisitedStaking) {
            handleNewStakingFeature()
        }
        await getParticipationEvents()
        await getParticipationOverview()
    })

    /** Subscribe to transfer state */
    const unsubscribeFromTransferState = transferState.subscribe((state) => {
        if (!$isSoftwareProfile) {
            handleTransferState(state)
        }
    })

    onDestroy(() => {
        unsubscribeFromTransferState()
    })
</script>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap p-10 flex-1 bg-gray-50 dark:bg-gray-900">
    <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
        <div class="h-full flex flex-col space-y-3 overflow-hidden">
            <DashboardPane classes="w-full flex-shrink-0">
                <StakingSummary />
            </DashboardPane>
            <DashboardPane classes="w-full flex-grow">
                <StakingInfo />
            </DashboardPane>
        </div>
        <DashboardPane classes="h-full">
            <StakingAirdrop airdrop={_StakingAirdrop.Assembly} />
        </DashboardPane>
        <DashboardPane classes="h-full">
            <StakingAirdrop airdrop={_StakingAirdrop.Shimmer} />
        </DashboardPane>
    </div>
</div>

<style type="text/scss">
    :global(body.platform-win32) .staking-wrapper {
        @apply pt-0;
    }
</style>
