<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Unit } from '@iota/unit-converter'
    import { Button, Icon, Illustration, Text } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency, isFiatCurrency } from 'shared/lib/currency'
    import { isAccountStaked, isParticipationPossible } from 'shared/lib/participation'
    import { selectedAccountParticipationOverview } from 'shared/lib/participation/account'
    import { TREASURY_VOTE_EVENT_ID } from 'shared/lib/participation/constants'
    import { assemblyStakingEventState, shimmerStakingEventState } from 'shared/lib/participation/stores'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile } from 'shared/lib/profile'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { TrackedParticipationItem } from 'shared/lib/participation/types'
    import { mobile } from '@lib/app'

    export let accountId: string
    export let internal = false
    export let to = ''
    export let amount = 0
    export let unit = Unit.i

    export let onConfirm = (..._: any[]): void => {}

    const displayAmount = getFormattedAmount()

    enum ActiveParticipationType {
        StakeVote = 'stakeVote',
        Stake = 'stake',
        Vote = 'vote',
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

    function handleCancelClick() {
        closePopup()
    }
</script>

<Text type="h4" classes={$mobile ? 'flex w-full justify-center -mt-4 mb-6' : 'mb-6'}>
    {localize('popups.transaction.title')}
</Text>
<div class="flex w-full flex-row flex-wrap {$mobile && '-mb-4'}">
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
        <div class="illustration w-full {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'} flex justify-center">
            <Illustration illustration="balance-desktop" />
        </div>
        <div class="w-full text-center my-6 px-10">
            <Text type="h4" highlighted classes="mb-2">
                {localize('popups.transaction.body', { values: { amount: displayAmount } })}
            </Text>
            <Text type={internal ? 'p' : 'pre'} secondary bigger>{to}</Text>
        </div>
    {/if}
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={() => handleCancelClick()}>{localize('actions.cancel')}</Button>
        {#if mustAcknowledgeGenericParticipationWarning || mustAcknowledgeBelowMinRewardParticipationWarning}
            <Button classes="w-full" onClick={handleNextClick}>{localize('actions.next')}</Button>
        {:else}
            <Button classes="w-full" onClick={onConfirm}>{localize('actions.confirm')}</Button>
        {/if}
    </div>
</div>

<style type="text/scss">
    .illustration {
        height: 250px;
        :global(img) {
            min-height: 280px;
            max-width: 100%;
            object-position: 0 -3px;
        }
    }
</style>
