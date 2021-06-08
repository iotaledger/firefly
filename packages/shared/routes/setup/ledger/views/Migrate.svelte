<script lang="typescript">
    import { Box, Button, OnboardingLayout, Spinner, Text } from 'shared/components'
    import {
        AvailableExchangeRates,
        convertToFiat,
        currencies,
        CurrencyTypes,
        exchangeRates,
        formatCurrency,
    } from 'shared/lib/currency'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile
    export let balance

    const dispatch = createEventDispatcher()

    let loading = false
    let timeout

    let fiatbalance = formatCurrency(
        convertToFiat(balance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[AvailableExchangeRates.USD]),
        AvailableExchangeRates.USD
    )

    function handleContinueClick() {
        // TODO: dummy
        loading = true
        timeout = setTimeout(() => {
            dispatch('next')
        }, 2000)
    }

    function handleBackClick() {
        dispatch('previous')
    }

    onDestroy(() => {
        clearTimeout(timeout)
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.migrateLedgerFunds.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.migrateLedgerFunds.body1')}</Text>
            <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.migrateLedgerFunds.body2')}</Text>
            <Box classes="flex flex-col flex-grow items-center py-12 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg ">
                <Text type="h2">{formatUnitBestMatch(balance, true, 3)}</Text>
                <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
            </Box>
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-7">
            <Button disabled={loading} classes="w-full" onClick={() => handleContinueClick()}>
                {#if loading}
                    <Spinner busy={loading} message={locale('views.migrateLedgerFunds.transfering')} classes="justify-center" />
                {:else}{locale('views.migrateLedgerFunds.transfer')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}
