<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import type { WalletAccount } from 'lib/typings/wallet'
    import { wallet } from 'shared/lib/wallet'
    import { Button, Icon, Illustration, Text } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency, isFiatCurrency } from 'shared/lib/currency'
    import { isAccountStaked, isStakingPossible } from 'shared/lib/participation'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile } from 'shared/lib/profile'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { get } from 'svelte/store'
    import { participationOverview, stakingEventState } from 'shared/lib/participation/stores'

    export let locale: Locale

    export let accountId
    export let internal = false
    export let to = ''
    export let amount = 0
    export let unit = Unit.i

    export let onConfirm = (..._: any[]): void => {}

    const displayAmount = getFormattedAmount()

    const _getAccount = (accounts: WalletAccount[]): WalletAccount =>
        accounts.find((account) => account.id === accountId)

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

    let mustAcknowledgeGenericParticipationWarning
    $: mustAcknowledgeGenericParticipationWarning = isAccountStaked(accountId) && isStakingPossible($stakingEventState)

    let mustAcknowledgeBelowMinRewardParticipationWarning
    $: {
        const { accounts } = get(wallet)
        const account = _getAccount(get(accounts))
        const accountOverview = $participationOverview.find((apo) => apo.accountIndex === account?.index)
        mustAcknowledgeBelowMinRewardParticipationWarning =
            accountOverview?.assemblyRewardsBelowMinimum > 0 || accountOverview?.shimmerRewardsBelowMinimum > 0
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

<Text type="h4" classes="mb-6">{locale('popups.transaction.title')}</Text>
<div class="flex w-full flex-row flex-wrap">
    {#if mustAcknowledgeGenericParticipationWarning || mustAcknowledgeBelowMinRewardParticipationWarning}
        <div
            class="relative flex flex-col items-center bg-red-500 dark:bg-gray-800 bg-opacity-10 rounded-2xl mt-6 mb-9 p-3">
            <div class="bg-red-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="warning" classes="text-white" />
            </div>
            <Text type="p" classes="dark:text-white mx-4 mb-4 mt-6">
                {locale(mustAcknowledgeBelowMinRewardParticipationWarning ? 'popups.transaction.sendingFromStakedAccountBelowMinReward' : 'popups.transaction.sendingFromStakedAccount')}
            </Text>
        </div>
    {:else}
        <div class="illustration w-full bg-pastel-yellow dark:bg-gray-900 flex justify-center">
            <Illustration illustration="balance-desktop" />
        </div>
        <div class="w-full text-center my-6 px-10">
            <Text type="h4" highlighted classes="mb-2">
                {locale('popups.transaction.body', { values: { amount: displayAmount } })}
            </Text>
            <Text type={internal ? 'p' : 'pre'} secondary bigger>{to}</Text>
        </div>
    {/if}
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        {#if mustAcknowledgeGenericParticipationWarning || mustAcknowledgeBelowMinRewardParticipationWarning}
            <Button classes="w-full" onClick={handleNextClick}>{locale('actions.next')}</Button>
        {:else}
            <Button classes="w-full" onClick={onConfirm}>{locale('actions.confirm')}</Button>
        {/if}
    </div>
</div>
