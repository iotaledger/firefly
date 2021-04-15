<script lang="typescript">
    import { Box, Button, Illustration, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { AvailableExchangeRates, convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
    import { formatUnit } from 'shared/lib/units'
    import {
        getInputIndexesForBundle,
        hasSingleBundle,
        hasBundlesWithSpentAddresses,
        migration,
        createMigrationBundle,
        sendMigrationBundle,
        unselectedInputs,
        confirmedBundles,
    } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'

    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    const { didComplete, bundles, data } = $migration
    const { balance } = $data

    let migratableBalance = balance - $unselectedInputs.reduce((acc, input) => acc + input.balance, 0)

    let fiatbalance = `${convertToFiat(
        migratableBalance,
        get(currencies)[CurrencyTypes.USD],
        get(exchangeRates)[AvailableExchangeRates.USD]
    )} ${CurrencyTypes.USD}`

    let loading = false

    let timeout

    let singleMigrationBundleHash

    confirmedBundles.subscribe((newConfirmedBundles) => {
        newConfirmedBundles.forEach((bundle) => {
            if (bundle.bundleHash && bundle.bundleHash === singleMigrationBundleHash && bundle.confirmed) {
                didComplete.set(true)
                loading = false
                dispatch('next')
            }
        })
    })

    function handleContinueClick() {
        if ($hasSingleBundle && !$hasBundlesWithSpentAddresses) {
            loading = true

            createMigrationBundle(getInputIndexesForBundle($bundles[0]), 0, false)
                .then((response) => {
                    singleMigrationBundleHash = response.payload.bundleHash
                    return sendMigrationBundle(response.payload.bundleHash)
                })
                .catch(() => {
                    loading = false
                    showAppNotification({
                        type: 'error',
                        message: locale('error.global.generic'),
                    })
                })
        } else {
            loading = true
            timeout = setTimeout(() => {
                dispatch('next')
            }, 2000)
        }
    }

    //TODO: complete function functionality
    function learnAboutMigrationsClick() {
        console.log('Learn about migration clicked')
    }

    onDestroy(() => {
        clearTimeout(timeout)
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Text on:click={learnAboutMigrationsClick} type="h2" classes="mb-5">{locale('views.migrate.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.migrate.body1')}</Text>
            <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.migrate.body2')}</Text>
            <Box classes="flex flex-col flex-grow items-center py-12 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg ">
                <Text type="h2">{formatUnit(migratableBalance)}</Text>
                <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
            </Box>
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-7">
            <button on:click={learnAboutMigrationsClick}>
                <Text type="p" highlighted>{locale('views.migrate.learn')}</Text>
            </button>
            <Button disabled={loading} classes="w-full" onClick={() => handleContinueClick()}>
                {#if loading}
                    <Spinner busy={loading} message={locale('views.migrate.migrating')} classes="justify-center" />
                {:else}{locale('views.migrate.beginMigration')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
