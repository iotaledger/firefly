<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Box, Button, Illustration, OnboardingLayout, Spinner, Text, Toast } from 'shared/components'
    import { AvailableExchangeRates, convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { formatUnit } from 'shared/lib/units'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    let balance = Math.floor(Math.random() * 2000000) // TODO: dummy
    let fiatbalance = `${convertToFiat(
        balance,
        get(currencies)[CurrencyTypes.USD],
        get(exchangeRates)[AvailableExchangeRates.USD]
    )} ${CurrencyTypes.USD}`

    let loading = false
    let migratingFundsMessage = ''

    function handleContinueClick() {
        loading = true
        migratingFundsMessage = locale('views.migrate.migrating')
        setTimeout(() => {
            //dispatch('next')
        }, 2000)
    }
    //TODO: complete function functionality
    function learnAboutMigrationsClick() {
        console.log('Learn about migration clicked')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} class="">
        <div slot="leftpane__content">
            <Text on:click={learnAboutMigrationsClick} type="h1" classes="mb-5 mt-5">{locale('views.migrate.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.migrate.body_1')}</Text>
            <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.migrate.body_2')}</Text>
            <Box classes="bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg ">
                <balance class="flex flex-col flex-grow items-center py-12">
                    <div class="flex mb-2">
                        <Text type="h2">{formatUnit(balance)}</Text>
                    </div>
                    <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
                </balance>
            </Box>
        </div>
        <div slot="leftpane__action" class="flex flex-col items-center space-x-4">
            <Button disabled={loading} classes="w-full" onClick={() => handleContinueClick()}>
                <Spinner busy={loading} message={migratingFundsMessage} classes="justify-center" />
                {#if !loading}
                    {locale('views.migrate.beginMigration')}
                {/if}
            </Button>
            <div on:click={learnAboutMigrationsClick}>
                <Text type="p" secondary highlighted classes="m-7 font-bold cursor-pointer">{locale('views.migrate.learn')}</Text>
            </div>
        </div>
        <div slot="rightpane" class="h-full flex">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
