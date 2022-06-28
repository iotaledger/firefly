<script lang="typescript">
    import { get } from 'svelte/store'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { Animation, Box, Button, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { addNewProfile, login, loadPersistedProfileIntoActiveProfile } from '@core/profile'
    import { newProfile } from '@contexts/onboarding'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { getLegacyErrorMessage, promptUserToConnectLedger } from '@lib/ledger'
    import {
        ADDRESS_SECURITY_LEVEL,
        confirmedBundles,
        hardwareIndexes,
        hasBundlesWithSpentAddresses,
        hasSingleBundle,
        migration,
        unselectedInputs,
    } from '@lib/migration'
    import { showAppNotification } from '@lib/notifications'
    import { Platform } from '@lib/platform'
    import { closePopup } from '@lib/popup'
    import { formatUnitBestMatch } from '@lib/units'
    import { walletSetupType } from '@lib/wallet'
    import { AvailableExchangeRates, CurrencyTypes } from '@lib/typings/currency'
    import { SetupType } from '@lib/typings/setup'

    const dispatch = createEventDispatcher()
    const legacyLedger = $walletSetupType === SetupType.TrinityLedger
    const { didComplete, data } = $migration
    const { balance } = $data
    const migratableBalance = balance - $unselectedInputs.reduce((acc, input) => acc + input.balance, 0)
    const fiatbalance = formatCurrency(
        convertToFiat(
            migratableBalance,
            get(currencies)[CurrencyTypes.USD],
            get(exchangeRates)[AvailableExchangeRates.USD]
        ),
        AvailableExchangeRates.USD
    )

    let loading = false
    let timeout: NodeJS.Timeout
    const singleMigrationBundleHash = ''
    const closeTransport = () => {}

    $: animation = legacyLedger ? 'ledger-migrate-desktop' : 'migrate-desktop'

    function unsubscribe(): void {
        confirmedBundles.subscribe((newConfirmedBundles) => {
            newConfirmedBundles.forEach((bundle) => {
                if (bundle.bundleHash && bundle.bundleHash === singleMigrationBundleHash && bundle.confirmed) {
                    didComplete.set(true)
                    loading = false
                    dispatch('next')
                }
            })
        })
    }

    function _onConnected(): void {
        Platform.ledger
            .selectSeed($hardwareIndexes.accountIndex, $hardwareIndexes.pageIndex, ADDRESS_SECURITY_LEVEL)
            // .then(({ iota, callback }) => {
            //     closeTransport = callback
            //     return createLedgerMigrationBundle(0, iota.prepareTransfers, callback)
            // })
            // .then(({ trytes, bundleHash }) => {
            //     closePopup(true) // close transaction popup
            //     singleMigrationBundleHash = bundleHash
            //     return sendLedgerMigrationBundle(bundleHash, trytes)
            // })
            .then(() => {
                if ($newProfile) {
                    // Save profile
                    addNewProfile($newProfile)
                    loadPersistedProfileIntoActiveProfile($newProfile.id)
                    void login()
                    newProfile.set(null)
                }
            })
            .catch((error) => {
                loading = false
                closePopup(true) // close transaction popup
                closeTransport()
                showAppNotification({
                    type: 'error',
                    message: localize(getLegacyErrorMessage(error)),
                })
                console.error(error)
            })
    }

    function _onCancel(): void {
        loading = false
    }

    function handleContinueClick(): void {
        if ($hasSingleBundle && !$hasBundlesWithSpentAddresses) {
            loading = true

            if (legacyLedger) {
                promptUserToConnectLedger(true, _onConnected, _onCancel)
            } else {
                // createMigrationBundle(getInputIndexesForBundle($bundles[0]), 0, false)
                //     .then((data) => {
                //         singleMigrationBundleHash = data.bundleHash
                //         return sendMigrationBundle(data.bundleHash).then(() => {
                //             // Save profile
                //             addNewProfile($newProfile)
                //             loadPersistedProfileIntoActiveProfile($newProfile.id)
                //             void login()
                //             newProfile.set(null)
                //         })
                //     })
                //     .catch((err) => {
                //         loading = false
                //         if (!err?.snapshot) {
                //             showAppNotification({
                //                 type: 'error',
                //                 message: localize('views.migrate.error'),
                //             })
                //         }
                //     })
            }
        } else {
            loading = true
            timeout = setTimeout(() => {
                dispatch('next')
            }, 2000)
        }
    }

    // TODO: complete function functionality
    function learnAboutMigrationsClick(): void {
        Platform.openUrl('https://blog.iota.org/firefly-token-migration/')
    }

    onDestroy(() => {
        clearTimeout(timeout)
        unsubscribe()
    })
</script>

<OnboardingLayout allowBack={false} showLedgerProgress={legacyLedger} showLedgerVideoButton={legacyLedger}>
    <div slot="title">
        <Text on:click={() => !$mobile && learnAboutMigrationsClick()} type="h2">{localize('views.migrate.title')}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.migrate.body1')}</Text>
        <Text type="p" secondary highlighted classes="mb-8 font-bold">{localize('views.migrate.body2')}</Text>
        <Box
            classes="flex flex-col flex-grow items-center py-12 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg "
        >
            <Text type="h2">{formatUnitBestMatch(migratableBalance, true, 3)}</Text>
            <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
        </Box>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-7">
        <button on:click={learnAboutMigrationsClick}>
            <Text type="p" highlighted>{localize('views.migrate.learn')}</Text>
        </button>
        <Button disabled={loading} classes="w-full" onClick={handleContinueClick}>
            {#if loading}
                <Spinner busy={loading} message={localize('views.migrate.migrating')} classes="justify-center" />
            {:else}{localize('views.migrate.beginMigration')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" {animation} />
    </div>
</OnboardingLayout>
