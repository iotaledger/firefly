<script lang="typescript">
    import { Animation, Button, Icon, Illustration, ProgressBar, Text } from 'shared/components'
    import { localize } from '@core/i18n'

    import { Unit } from '@iota/unit-converter'

    import { convertToFiat, currencies, exchangeRates, formatCurrency, isFiatCurrency } from '@lib/currency'
    import { TransferProgressEventType } from '@lib/typings/events'
    import { isAccountStaked, isParticipationPossible } from '@lib/participation'
    import { selectedAccountParticipationOverview } from '@lib/participation/account'
    import { TREASURY_VOTE_EVENT_ID } from '@lib/participation/constants'
    import { assemblyStakingEventState, shimmerStakingEventState } from '@lib/participation/stores'
    import { activeProfile } from '@lib/profile'
    import { AvailableExchangeRates, CurrencyTypes } from '@lib/typings/currency'
    import { formatUnitBestMatch, formatUnitPrecision } from '@lib/units'
    import { TrackedParticipationItem } from '@lib/participation/types'
    import { isTransferring, transferState } from '@lib/wallet'

    import { fade } from 'svelte/transition'

    export let accountId: string
    export let internal = false
    export let to = ''
    export let amount = 0
    export let unit = Unit.i
    export let fadeContent = false

    export let handleBackButton = (..._: any[]): void => {}
    export let onConfirm = (..._: any[]): void => {}
    export let onComplete = (): void => {}

    const displayAmount = getFormattedAmount()

    enum ActiveParticipationType {
        StakeVote = 'stakeVote',
        Stake = 'stake',
        Vote = 'vote',
    }

    const transferSteps: {
        [key in TransferProgressEventType]: {
            label: string
            percent: number
        }
    } = {
        SyncingAccount: {
            label: localize('general.transferSyncing'),
            percent: 20,
        },
        SelectingInputs: {
            label: localize('general.transferSelectingInputs'),
            percent: 30,
        },
        GeneratingRemainderDepositAddress: {
            label: localize('general.transferRemainderAddress'),
            percent: 40,
        },
        PreparedTransaction: {
            label: localize('general.transferPreparedTransaction'),
            percent: 50,
        },
        SigningTransaction: {
            label: localize('general.transferSigning'),
            percent: 60,
        },
        PerformingPoW: {
            label: localize('general.transferPow'),
            percent: 70,
        },
        Broadcasting: {
            label: localize('general.transferBroadcasting'),
            percent: 80,
        },
        Complete: {
            label: localize('general.transferComplete'),
            percent: 100,
        },
    }

    let treasuryVoteParticipations: TrackedParticipationItem[]
    $: treasuryVoteParticipations =
        Object.values($selectedAccountParticipationOverview?.trackedParticipations?.[TREASURY_VOTE_EVENT_ID] || {}) ??
        []
    $: isAccountVoting =
        !!treasuryVoteParticipations?.find((trackedParticipation) => trackedParticipation?.endMilestoneIndex === 0) ??
        false

    let activeParticipationType: ActiveParticipationType | ''
    $: {
        if (isAccountStaked(accountId) && isAccountVoting) {
            activeParticipationType = ActiveParticipationType.StakeVote
        } else if (isAccountStaked(accountId)) {
            activeParticipationType = ActiveParticipationType.Stake
        } else if (isAccountVoting) {
            activeParticipationType = ActiveParticipationType.Vote
        } else {
            activeParticipationType = ''
        }
    }

    $: mustAcknowledgeGenericParticipationWarning =
        (isAccountStaked(accountId) &&
            (isParticipationPossible($assemblyStakingEventState) ||
                isParticipationPossible($shimmerStakingEventState))) ||
        isAccountVoting

    let mustAcknowledgeBelowMinRewardParticipationWarning: boolean
    $: {
        const accountOverview = $selectedAccountParticipationOverview
        mustAcknowledgeBelowMinRewardParticipationWarning =
            (accountOverview?.assemblyRewardsBelowMinimum > 0 &&
                accountOverview?.assemblyRewards <= 0 &&
                isParticipationPossible($assemblyStakingEventState)) ||
            (accountOverview?.shimmerRewardsBelowMinimum > 0 &&
                accountOverview?.shimmerRewards <= 0 &&
                isParticipationPossible($shimmerStakingEventState))
    }

    function getFormattedAmount() {
        const isFiat = isFiatCurrency(unit)
        const currency = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD

        const iotaAmount = isFiat ? formatUnitBestMatch(amount) : formatUnitPrecision(amount, unit)
        const fiatAmount = formatCurrency(
            convertToFiat(amount, $currencies[CurrencyTypes.USD], $exchangeRates[currency]),
            currency
        )

        return isFiat ? `${fiatAmount} (${iotaAmount})` : `${iotaAmount} (${fiatAmount})`
    }

    function handleNextClick() {
        /**
         * NOTE: We are setting to false because once
         * it has been acknowledged it does not have to
         * be acknowledged anymore.
         */
        mustAcknowledgeGenericParticipationWarning = false
        mustAcknowledgeBelowMinRewardParticipationWarning = false
    }

    let transferStarted = false

    isTransferring.subscribe((curr) => {
        if (curr) {
            transferStarted = true
        }
        if (curr === false && transferStarted) {
            onComplete()
        }
    })
</script>

<button on:click={handleBackButton} class="absolute top-8 -left-2">
    <Icon icon="arrow-left" classes="absolute mb-5 left-8 text-gray-500 text-blue-500" />
</button>
<div class="flex flex-col items-center justify-items-center p-5">
    <div class="w-full text-center mt-3">
        <Text bold bigger>{localize('popups.transaction.title')}</Text>
    </div>
    <div class="w-full overflow-hidden mt-5 grid">
        {#if fadeContent}
            <div class="animation w-full" in:fade={{ duration: 1000 }}>
                <Animation classes="relative right-2.5" animation="balance-desktop" scale={1.2} />
            </div>
        {:else}
            <div class="illustration w-full" out:fade={{ duration: 2000 }}>
                <Illustration classes="relative right-2.5" illustration="balance-desktop" scale={1.2} />
            </div>
        {/if}
    </div>
    <div class="flex w-full h-full flex-row flex-wrap">
        {#if mustAcknowledgeGenericParticipationWarning || mustAcknowledgeBelowMinRewardParticipationWarning}
            <div
                class="relative flex flex-col items-center bg-red-500 dark:bg-gray-800 bg-opacity-10 rounded-2xl mt-6 mb-9 p-3"
            >
                <div class="bg-red-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                    <Icon icon="warning" classes="text-white" />
                </div>
                <Text type="p" classes="dark:text-white mx-4 mb-4 mt-6">
                    {localize(
                        mustAcknowledgeBelowMinRewardParticipationWarning
                            ? `popups.transaction.${
                                  activeParticipationType === ActiveParticipationType.Stake
                                      ? 'sendingFromStakedAccountBelowMinReward'
                                      : 'sendingFromStakedAccountBelowMinRewardVote'
                              }`
                            : `popups.transaction.sendingFromActiveParticipationAccount.${activeParticipationType}`
                    )}
                </Text>
            </div>
        {:else}
            <div class="w-full text-center px-10">
                <Text type="h4" highlighted classes="mb-2">
                    {localize('popups.transaction.body', { values: { amount: displayAmount } })}
                </Text>
                <Text type={internal ? 'p' : 'pre'} secondary bigger>{to}</Text>
            </div>
        {/if}
    </div>
</div>
<div class="confirmButton w-full absolute left-0 px-5">
    {#if $isTransferring}
        <ProgressBar
            classes="w-full"
            preloading={!$transferState}
            secondary
            message={transferSteps[$transferState?.type || TransferProgressEventType.SyncingAccount]?.label}
            percent={transferSteps[$transferState?.type || TransferProgressEventType.SyncingAccount]?.percent}
        />
    {:else if mustAcknowledgeGenericParticipationWarning || mustAcknowledgeBelowMinRewardParticipationWarning}
        <Button classes="w-full" onClick={handleNextClick}>{localize('actions.next')}</Button>
    {:else}
        <Button classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
    {/if}
</div>

<style type="text/scss">
    .illustration {
        grid-column: 1;
        grid-row: 1;
    }

    .animation {
        grid-column: 1;
        grid-row: 1;
    }

    .confirmButton {
        bottom: calc(env(safe-area-inset-bottom) + 30px);
    }
</style>
