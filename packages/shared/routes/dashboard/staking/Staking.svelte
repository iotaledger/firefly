<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import {
        assemblyStakingEventState,
        participationAction,
        shimmerStakingEventState,
    } from 'shared/lib/participation/stores'
    import {
        ParticipationAction,
        ParticipationEventState,
        StakingAirdrop as _StakingAirdrop,
    } from 'shared/lib/participation/types'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { TransferProgressEventData, TransferProgressEventType, TransferState } from 'shared/lib/typings/events'
    import { handleTransactionEventData, transferState } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'
    import { StakingAirdrop, StakingInfo, StakingSummary } from './views'
    import {
        ASSEMBLY_EVENT_ID,
        ASSEMBLY_EVENT_START_DATE,
        LAST_ASSEMBLY_STAKING_PERIOD,
        CURRENT_ASSEMBLY_STAKING_PERIOD,
    } from 'shared/lib/participation/constants'

    const handleNewStakingEvent = (): void => {
        if (
            ASSEMBLY_EVENT_ID &&
            ASSEMBLY_EVENT_START_DATE &&
            CURRENT_ASSEMBLY_STAKING_PERIOD > 0 &&
            LAST_ASSEMBLY_STAKING_PERIOD < CURRENT_ASSEMBLY_STAKING_PERIOD
        ) {
            openPopup({
                type: 'newStakingPeriodNotification',
                hideClose: true,
                preventClose: false,
            })
        }

        updateProfile('hasVisitedStaking', true)
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
                // Re-open the staking manager pop up if you are in the staking tab
                if (
                    $participationAction === ParticipationAction.Stake ||
                    $participationAction === ParticipationAction.Unstake
                ) {
                    openPopup({ type: 'stakingManager' }, true)
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

    $: if (!$participationAction && ledgerAwaitingConfirmation && $popupState.type === 'ledgerTransaction') {
        closePopup(true)
    }

    $: if (
        $popupState.type === 'stakingManager' &&
        $assemblyStakingEventState === ParticipationEventState.Inactive &&
        $shimmerStakingEventState === ParticipationEventState.Inactive
    ) {
        closePopup(true)
    }

    onMount(() => {
        if (!$activeProfile?.hasVisitedStaking) {
            handleNewStakingEvent()
        }
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
        <div class="h-full flex flex-col space-y-3 min-h-0">
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
