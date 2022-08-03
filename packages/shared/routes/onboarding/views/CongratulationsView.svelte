<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { mobile } from '@core/app'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { Platform } from '@lib/platform'
    import { promptUserToConnectLedger } from '@lib/ledger'
    import { LOG_FILE_NAME, migration, migrationLog, resetMigrationState, totalMigratedBalance } from '@lib/migration'
    import { onboardingRouter, ledgerSetupRouter } from '@core/router'
    import { LedgerAppName } from '@lib/typings/ledger'
    import { formatUnitBestMatch } from '@lib/units'
    import { AvailableExchangeRates, CurrencyTypes } from '@lib/typings/currency'
    import { localize } from '@core/i18n'
    import { completeOnboardingProcess, ProfileRecoveryType } from '@contexts/onboarding'
    import { activeProfile, getStorageDirectoryOfProfile } from '@core/profile'
    import { onboardingProfile } from '@contexts/onboarding'

    const { didComplete } = $migration
    const wasMigrated = $didComplete

    let localizedBody = 'body'
    let localizedValues: { legacy: LedgerAppName }
    let logExported = false

    const fiatbalance = formatCurrency(
        convertToFiat(
            // Only show actually migrated balance to user
            $totalMigratedBalance,
            get(currencies)[CurrencyTypes.USD],
            get(exchangeRates)[AvailableExchangeRates.USD]
        ),
        AvailableExchangeRates.USD
    )

    function advanceView(): void {
        completeOnboardingProcess()
        $onboardingRouter.next()
    }

    function handleContinueClick(): void {
        if (wasMigrated) {
            const _continue = () => {
                /**
                 * We check for the new Ledger IOTA app to be connected after migration
                 * because the last app the user had open was the legacy one
                 */
                if ($onboardingProfile?.recoveryType === ProfileRecoveryType.TrinityLedger) {
                    promptUserToConnectLedger(false, advanceView)
                } else {
                    advanceView()
                }
            }
            const _exportMigrationLog = () => {
                getStorageDirectoryOfProfile($activeProfile?.id)
                    .then((source) =>
                        $onboardingProfile?.recoveryType === ProfileRecoveryType.TrinityLedger
                            ? Platform.exportLedgerMigrationLog($migrationLog, `${$activeProfile?.id}-${LOG_FILE_NAME}`)
                            : Platform.exportMigrationLog(
                                  `${source}/${LOG_FILE_NAME}`,
                                  `${$activeProfile?.id}-${LOG_FILE_NAME}`
                              )
                    )
                    .then((result) => {
                        if (result) {
                            logExported = true
                            _continue()
                        }
                    })
                    .catch(console.error)
            }
            if (logExported) {
                _continue()
            } else {
                _exportMigrationLog()
            }
        } else {
            advanceView()
        }
    }

    onMount(() => {
        if (!wasMigrated) {
            if ($onboardingProfile?.recoveryType === ProfileRecoveryType.FireflyLedger) {
                localizedBody = 'fireflyLedgerBody'
            }
        } else {
            if ($onboardingProfile?.recoveryType === ProfileRecoveryType.TrinityLedger) {
                localizedBody = 'trinityLedgerBody'
                localizedValues = { legacy: LedgerAppName.IOTALegacy }

                // updateProfile('ledgerMigrationCount', $activeProfile?.ledgerMigrationCount + 1)
            } else {
                localizedBody = 'softwareMigratedBody'
            }
        }
    })

    onDestroy(() => {
        if (wasMigrated) {
            resetMigrationState()
        }
        $ledgerSetupRouter.reset()
    })
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        {#if wasMigrated}
            <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
                <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mb-6 text-center">{localize('views.congratulations.fundsMigrated')}</Text>
                <Text type="p" secondary classes="mb-6 text-center">
                    {localize(`views.congratulations.${localizedBody}`, { values: localizedValues })}
                </Text>
                <Text type="h2">{formatUnitBestMatch($totalMigratedBalance, true, 3)}</Text>
                <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
            </div>
        {:else}
            <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
                <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mb-5 text-center">{localize('views.congratulations.title')}</Text>
                <Text type="p" secondary classes="mb-2 text-center"
                    >{localize(`views.congratulations.${localizedBody}`)}</Text
                >
            </div>
        {/if}
    </div>
    <div slot="leftpane__action">
        <Button autofocus classes="w-full" onClick={handleContinueClick}>
            {localize(
                `${wasMigrated && !logExported ? 'views.congratulations.exportMigration' : 'actions.finishSetup'}`
            )}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="congratulations-desktop" />
    </div>
</OnboardingLayout>
