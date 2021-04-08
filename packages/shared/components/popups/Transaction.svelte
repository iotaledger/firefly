<script lang="typescript">
    import { AvailableExchangeRates,convertToFiat,currencies,CurrencyTypes,exchangeRates } from 'shared/lib/currency'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile } from 'shared/lib/profile'
    import { formatUnit } from 'shared/lib/units'
    import { get } from 'svelte/store'

    export let locale
    export let internal = false
    export let to = ''
    export let amount = 0
    export let onConfirm = () => {}

    let displayedAmount = `${formatUnit(amount)} (${converToFiat(amount)})`

    function converToFiat(amount) {
        const activeCurrency = get(activeProfile)?.settings.currency ?? AvailableExchangeRates.USD
        return `${convertToFiat(
            amount,
            get(currencies)[CurrencyTypes.USD],
            get(exchangeRates)[activeCurrency]
        )} ${activeCurrency}`
    }

    function handleCancelClick() {
        closePopup()
    }
</script>

<style type="text/scss">
    .illustration {
        :global(img){
            max-height: 260px;
            object-position: 0 10px;
        }
    }
</style>

<Text type="h4" classes="mb-5">{locale('popups.transaction.title')}</Text>
<div class="flex w-full flex-row flex-wrap">
    <div class="illustration w-full bg-pastel-yellow dark:bg-gray-900 flex justify-center content-center">
        <Illustration height="260px" illustration="balance-desktop" />
    </div>
    <div class="w-full text-center my-6 px-10">
        <Text type="h4" highlighted classes="mb-2">
            {locale('popups.transaction.body', { values: { amount: displayedAmount } })}
        </Text>
        <Text type={internal ? 'p' : 'pre'} secondary bigger>{to}</Text>
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onConfirm}>{locale('actions.confirm')}</Button>
    </div>
</div>
