<!-- TODO: all this file is kind of duplicate of Setup > Balance.svelte -->
<script>
    import { Animation, Box, Button, OnboardingLayout, Spinner, Text } from 'shared/components'
    import {
        AvailableExchangeRates,
        convertToFiat,
        currencies,
        CurrencyTypes,
        exchangeRates,
        formatCurrency,
    } from 'shared/lib/currency'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile
    export let balance

    const dispatch = createEventDispatcher()

    // TODO: missing check again for balance function
    function sync() {}

    const getFiatBalance = (balance) => {
        const balanceAsFiat = convertToFiat(
            balance,
            get(currencies)[CurrencyTypes.USD],
            get(exchangeRates)[AvailableExchangeRates.USD]
        )

        if (balanceAsFiat === 0) {
            return `< ${formatCurrency(0.01, AvailableExchangeRates.USD)}`
        }
        return formatCurrency(balanceAsFiat, AvailableExchangeRates.USD)
    }

    let formattedBalance = formatUnitBestMatch(balance, true, 3)
    let fiatBalance = getFiatBalance(balance)
    let isCheckingForBalance = false

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-3.5">{locale('views.balance.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.balance.body')}</Text>
            <Box classes="flex flex-col flex-grow items-center py-12 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg ">
                <Text type="h2">{formattedBalance}</Text>
                <Text type="p" highlighted classes="py-1 uppercase">{fiatBalance}</Text>
            </Box>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center space-x-4">
            <Button secondary classes="flex-1" disabled={isCheckingForBalance} onClick={sync}>
                {#if isCheckingForBalance}
                    <Spinner
                        busy={isCheckingForBalance}
                        message={locale('views.migrate.findingBalance')}
                        classes="justify-center" />
                {:else}{locale('actions.checkAgain')}{/if}
            </Button>
            <Button classes="flex-1" disabled={isCheckingForBalance} onClick={handleContinueClick}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-yellow dark:bg-gray-900">
            <Animation animation="balance-desktop" />
        </div>
    </OnboardingLayout>
{/if}
