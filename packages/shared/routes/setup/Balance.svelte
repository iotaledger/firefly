<script lang="typescript">
    import { Animation, Box, Button, OnboardingLayout, Spinner, Text, Toast } from 'shared/components'
    import {
        AvailableExchangeRates,
        convertToFiat,
        currencies,
        CurrencyTypes,
        exchangeRates,
        formatCurrency,
    } from 'shared/lib/currency'
    import {
        bundlesWithUnspentAddresses,
        getMigrationData,
        hasAnySpentAddressWithNoBundleHashes,
        hasLowBalanceOnAllSpentAddresses,
        migration,
        MINIMUM_MIGRATION_BALANCE,
        resetMigrationState,
        spentAddressesWithNoBundleHashes,
        unselectedInputs,
    } from 'shared/lib/migration'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    let isCheckingForBalance

    const { seed, data, bundles } = $migration

    let _data = $data
    let _bundles = $bundles

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

    const hasInsufficientBalance = (balance) => balance < MINIMUM_MIGRATION_BALANCE

    const { balance } = _data

    let fiatBalance = getFiatBalance(balance)

    let error = getError(balance)
    let formattedBalance = formatUnitBestMatch(balance, true, 3)

    bundles.subscribe((updatedBundles) => {
        _bundles = updatedBundles
        error = getError(_data.balance)
    })

    unselectedInputs.subscribe(() => {
        error = getError(_data.balance)
    })

    const unsubscribe = data.subscribe((updatedData) => {
        _data = updatedData

        fiatBalance = getFiatBalance(_data.balance)
        formattedBalance = formatUnitBestMatch(_data.balance, true, 3)
        error = getError(_data.balance)
    })

    function getError(_balance) {
        if (_balance === 0) {
            return {
                allowToProceed: false,
                text: locale('views.balance.zeroBalance'),
            }
        }

        if (hasInsufficientBalance(_balance)) {
            return {
                allowToProceed: false,
                text: locale('views.balance.error'),
            }
        }

        if ($hasLowBalanceOnAllSpentAddresses && !$bundlesWithUnspentAddresses.length) {
            return {
                allowToProceed: false,
                text: locale('views.migrate.minimumMigrationAmountSpentAddresses'),
            }
        }

        if (!_bundles.length) {
            return {
                allowToProceed: false,
                text: locale('views.migrate.tooManyAddressesToMigrate'),
            }
        }

        if ($unselectedInputs.length) {
            const totalUnselectedBalance = $unselectedInputs.reduce((acc, input) => acc + input.balance, 0)

            return {
                allowToProceed: true,
                text: locale('views.migrate.cannotMigrateAllYourFunds', {
                    values: {
                        value: `${formatUnitBestMatch(totalUnselectedBalance, true, 3)} (${getFiatBalance(
                            totalUnselectedBalance
                        ).toUpperCase()})`,
                    },
                }),
            }
        }

        return {
            allowToProceed: true,
            text: null,
        }
    }

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        const spentAddressesWithNoBundleHashesTotalBalance = $spentAddressesWithNoBundleHashes.reduce(
            (acc, input) => acc + input.balance,
            0
        )
        if ($hasAnySpentAddressWithNoBundleHashes) {
            openPopup({
                type: 'missingBundle',
                props: {
                    onProceed: () => {
                        closePopup()
                        dispatch('next')
                    },
                    balance: `${formatUnitBestMatch(spentAddressesWithNoBundleHashesTotalBalance, true, 3)} (${getFiatBalance(
                        spentAddressesWithNoBundleHashesTotalBalance
                    ).toUpperCase()})`,
                },
            })
        } else {
            dispatch('next')
        }
    }
    function handleBackClick() {
        if (!isCheckingForBalance) {
            // If a user goes back from this point, reset migration state
            resetMigrationState()
            dispatch('previous')
        }
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
            {#if error.text}
                <Toast classes="mt-4" type="error" message={error.text} />
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center space-x-4">
            <Button secondary classes="flex-1" disabled={isCheckingForBalance} onClick={checkAgain}>
                {#if isCheckingForBalance}
                    <Spinner
                        busy={isCheckingForBalance}
                        message={locale('views.migrate.findingBalance')}
                        classes="justify-center" />
                {:else}{locale('actions.checkAgain')}{/if}
            </Button>
            <Button
                classes="flex-1"
                disabled={isCheckingForBalance || !error.allowToProceed}
                onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-yellow dark:bg-gray-900">
            <Animation animation="balance-desktop" />
        </div>
    </OnboardingLayout>
{/if}
