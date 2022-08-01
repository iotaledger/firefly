<script lang="typescript">
    import { Animation, Box, Button, OnboardingLayout, Spinner, Text, Toast } from 'shared/components'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { mobile } from '../../../../../lib/core/app'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '../../../../../lib/currency'
    import { Platform } from '../../../../../lib/platform'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from '../../../../../lib/ledger'
    import {
        ADDRESS_SECURITY_LEVEL,
        bundlesWithUnspentAddresses,
        hardwareIndexes,
        hasAnySpentAddressWithNoBundleHashes,
        hasLowBalanceOnAllSpentAddresses,
        MINIMUM_MIGRATION_BALANCE,
        resetMigrationState,
        spentAddressesWithNoBundleHashes,
        unselectedInputs,
    } from '../../../../../lib/migration'
    import { closePopup, openPopup } from '../../../../../lib/popup'
    import { formatUnitBestMatch } from '../../../../../lib/units'
    import { localize } from '../../../../../lib/core/i18n'
    import { AvailableExchangeRates, CurrencyTypes } from '../../../../../lib/typings/currency'
    import { ProfileRecoveryType, profileRecoveryType } from '../../../../../lib/contexts/onboarding'
    import { onboardingRouter } from '../../../../../lib/core/router'

    const legacyLedger = $profileRecoveryType === ProfileRecoveryType.TrinityLedger

    let isCheckingForBalance: boolean
    let _data = $data
    let _bundles = $bundles

    const { balance } = _data

    let fiatBalance = getFiatBalance(balance)
    let error = getError(balance)
    let formattedBalance = formatUnitBestMatch(balance, true, 3)

    function getFiatBalance(balance: number): string {
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

    function hasInsufficientBalance(balance: number): boolean {
        return balance < MINIMUM_MIGRATION_BALANCE
    }

    function unsubscribeBundles(): void {
        bundles.subscribe((updatedBundles) => {
            _bundles = updatedBundles
            error = getError(_data.balance)
        })
    }

    function unsubscribeUnselectedInputs(): void {
        unselectedInputs.subscribe(() => {
            error = getError(_data.balance)
        })
    }

    function unsubscribeData(): void {
        data.subscribe((updatedData) => {
            _data = updatedData

            fiatBalance = getFiatBalance(_data.balance)
            formattedBalance = formatUnitBestMatch(_data.balance, true, 3)
            error = getError(_data.balance)
        })
    }

    function getError(_balance): { allowToProceed: boolean; text: string } {
        if (_balance === 0) {
            return {
                allowToProceed: false,
                text: localize(`views.balance.${legacyLedger ? 'zeroBalanceLedgerLegacy' : 'zeroBalance'}`),
            }
        }

        if (hasInsufficientBalance(_balance)) {
            return {
                allowToProceed: false,
                text: localize('views.balance.error'),
            }
        }

        if ($hasLowBalanceOnAllSpentAddresses && !$bundlesWithUnspentAddresses.length) {
            return {
                allowToProceed: false,
                text: localize('views.migrate.minimumMigrationAmountSpentAddresses'),
            }
        }

        if (!_bundles.length) {
            return {
                allowToProceed: false,
                text: localize('views.migrate.tooManyAddressesToMigrate'),
            }
        }

        if ($unselectedInputs.length) {
            const totalUnselectedBalance = $unselectedInputs.reduce((acc, input) => acc + input.balance, 0)

            return {
                allowToProceed: true,
                text: localize('views.migrate.cannotMigrateAllYourFunds', {
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

    function handleContinueClick(): void {
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
                        $onboardingRouter.next()
                    },
                    balance: `${formatUnitBestMatch(
                        spentAddressesWithNoBundleHashesTotalBalance,
                        true,
                        3
                    )} (${getFiatBalance(spentAddressesWithNoBundleHashesTotalBalance).toUpperCase()})`,
                },
            })
        } else {
            $onboardingRouter.next()
        }
    }

    function handleBackClick(): void {
        if (!isCheckingForBalance) {
            // If a user goes back from this point, reset migration state
            resetMigrationState()
            $onboardingRouter.previous()
        }
    }

    function checkAgain(): void {
        isCheckingForBalance = true
        if (legacyLedger) {
            // TODO: add ledger legacy popup when PR merged
            const _onConnected = () => {
                Platform.ledger
                    .selectSeed($hardwareIndexes.accountIndex, $hardwareIndexes.pageIndex, ADDRESS_SECURITY_LEVEL)
                    // .then(({ iota, callback }) => getLedgerMigrationData(iota.getAddress, callback))
                    .then(() => {
                        isCheckingForBalance = false
                    })
                    .catch((error) => {
                        isCheckingForBalance = false

                        console.error(error)

                        displayNotificationForLedgerProfile('error', true, true, error)
                    })
            }
            const _onCancel = () => (isCheckingForBalance = false)
            promptUserToConnectLedger(true, _onConnected, _onCancel)
        } else {
            // getMigrationData($seed, $data.lastCheckedAddressIndex)
            //     .then(() => {
            //         isCheckingForBalance = false
            //     })
            //     .catch((error) => {
            //         isCheckingForBalance = false
            //         console.error(error)
            //     })
        }
    }

    onDestroy(() => {
        unsubscribeUnselectedInputs()
        unsubscribeBundles()
        unsubscribeData()
    })
</script>

<OnboardingLayout
    busy={isCheckingForBalance}
    onBackClick={handleBackClick}
    showLedgerProgress={legacyLedger}
    showLedgerVideoButton={legacyLedger}
>
    <div slot="title">
        <Text type="h2">{localize('views.balance.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-5">{localize('views.balance.body')}</Text>
        <Box
            classes="flex flex-col flex-grow items-center py-12 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg "
        >
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
                    message={localize('views.migrate.findingBalance')}
                    classes="justify-center"
                />
            {:else}{localize('actions.checkAgain')}{/if}
        </Button>
        <Button classes="flex-1" disabled={isCheckingForBalance || !error.allowToProceed} onClick={handleContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="balance-desktop" />
    </div>
</OnboardingLayout>
