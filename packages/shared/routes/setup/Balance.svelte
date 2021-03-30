<script lang="typescript">
    import { Box, Button, Illustration, OnboardingLayout, Text, Toast } from 'shared/components'
    import { AvailableExchangeRates, convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { formatUnit } from 'shared/lib/units'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    let balance = Math.floor(Math.random() * 2000000) // TODO: dummy
    let fiatbalance = `${convertToFiat(
        balance,
        get(currencies)[CurrencyTypes.USD],
        get(exchangeRates)[AvailableExchangeRates.USD]
    )} ${CurrencyTypes.USD}`

    let error = balance < 1000000 // TODO: dummy 1 MIOTA

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>not yet implemented</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.balance.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.balance.body')}</Text>
            <Box classes="flex flex-col flex-grow items-center py-12 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg ">
                <Text type="h2">{formatUnit(balance)}</Text>
                <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
            </Box>
            {#if error}
                <Toast classes="mt-4" type="error" message={locale('views.balance.error')} />
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center space-x-4">
            <Button secondary classes="flex-1" onClick={() => console.log('foo')}>{locale('actions.checkAgain')}</Button>
            <Button classes="flex-1" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-yellow dark:bg-gray-900">
            <Illustration illustration="balance-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
