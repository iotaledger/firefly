<script lang="typescript">
    import { Box, Button, Illustration, OnboardingLayout, Text, Toast } from 'shared/components'
    import { AvailableExchangeRates, convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { migration, getMigrationData, MINIMUM_MIGRATION_BALANCE } from 'shared/lib/migration'
    import { formatUnit } from 'shared/lib/units'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    let isCheckingForBalance

    const { seed, data } = $migration
    const { balance } = $data

    const getFiatBalance = (balance) =>
        `${convertToFiat(balance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[AvailableExchangeRates.USD])} ${
            CurrencyTypes.USD
        }`

    const hasInsufficientBalance = (balance) => balance < MINIMUM_MIGRATION_BALANCE

    let fiatBalance = getFiatBalance(balance)
    let error = hasInsufficientBalance(balance)
    let formattedBalance = formatUnit(balance)

    const unsubscribe = data.subscribe((_data) => {
        fiatBalance = getFiatBalance(_data.balance)
        formattedBalance = formatUnit(_data.balance)
        error = hasInsufficientBalance(_data.balance)
    })

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }

    function checkAgain() {
        isCheckingForBalance = true
        getMigrationData($seed, $data.lastCheckedAddressIndex)
            .then(() => {
                isCheckingForBalance = false
            })
            .catch((error) => {
                isCheckingForBalance = false
                console.error(error)
            })
    }

    onDestroy(unsubscribe)
</script>

{#if mobile}
    <div>not yet implemented</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-3.5">{locale('views.balance.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.balance.body')}</Text>
            <Box classes="flex flex-col flex-grow items-center py-12 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg ">
                <Text type="h2">{formattedBalance}</Text>
                <Text type="p" highlighted classes="py-1 uppercase">{fiatBalance}</Text>
            </Box>
            {#if error}
                <Toast classes="mt-4" type="error" message={locale('views.balance.error')} />
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center space-x-4">
            <Button secondary classes="flex-1" disabled={isCheckingForBalance} onClick={checkAgain}>{locale('actions.checkAgain')}</Button>
            <Button classes="flex-1" disabled={isCheckingForBalance || error} onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-yellow dark:bg-gray-900">
            <Illustration illustration="balance-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
