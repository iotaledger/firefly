<script lang="typescript">
    import { Animation, Box, Button, OnboardingLayout, Spinner, Text } from 'shared/components'
    import {
        AvailableExchangeRates,
        convertToFiat,
        currencies,
        CurrencyTypes,
        exchangeRates,
        formatCurrency,
    } from 'shared/lib/currency'
    import { Electron } from 'shared/lib/electron'
    import {
        confirmedBundles,
        createMigrationBundle,
        getInputIndexesForBundle,
        hasBundlesWithSpentAddresses,
        hasSingleBundle,
        migration,
        sendMigrationBundle,
        unselectedInputs,
    } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { newProfile, profileInProgress, saveProfile, setActiveProfile } from 'shared/lib/profile'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    const { didComplete, bundles, data } = $migration
    const { balance } = $data

    let migratableBalance = balance - $unselectedInputs.reduce((acc, input) => acc + input.balance, 0)

    let fiatbalance = formatCurrency(
        convertToFiat(migratableBalance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[AvailableExchangeRates.USD]),
        AvailableExchangeRates.USD
    )

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
                    return sendMigrationBundle(response.payload.bundleHash).then(() => {
                        // Save profile
                        saveProfile($newProfile)
                        setActiveProfile($newProfile.id)

                        profileInProgress.set(undefined)
                        newProfile.set(null)
                    })
                })
                .catch((err) => {
                    loading = false
                    if (!err?.snapshot) {
                        showAppNotification({
                            type: 'error',
                            message: locale('views.migrate.error'),
                        })
                    }
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
        Electron.openUrl('https://blog.iota.org/firefly-token-migration/')
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
                <Text type="h2">{formatUnitBestMatch(migratableBalance, true, 3)}</Text>
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
            <Animation animation="migrate-desktop" />
        </div>
    </OnboardingLayout>
{/if}
