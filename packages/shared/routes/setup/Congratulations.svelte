<script lang="typescript">
    import { get } from 'svelte/store'
    import { onDestroy, onMount } from 'svelte'
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { Platform } from 'shared/lib/platform'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import {
        LOG_FILE_NAME,
        migration,
        migrationLog,
        resetMigrationState,
        totalMigratedBalance,
    } from 'shared/lib/migration'
    import {
        activeProfile,
        newProfile,
        profileInProgress,
        saveProfile,
        setActiveProfile,
        updateProfile,
    } from 'shared/lib/profile'
    import { appRouter, ledgerRouter } from '@core/router'
    import { LedgerAppName } from 'shared/lib/typings/ledger'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { getProfileDataPath, walletSetupType } from 'shared/lib/wallet'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import { Locale } from '@core/i18n'
    import { SetupType } from 'shared/lib/typings/setup'

    export let locale: Locale

    const { didComplete } = $migration

    const wasMigrated = $didComplete

    let localizedBody = 'body'
    let localizedValues = {}
    let logExported = false

    onMount(() => {
        if (!wasMigrated) {
            if ($walletSetupType === SetupType.FireflyLedger) {
                localizedBody = 'fireflyLedgerBody'
            }
            // This is the last screen in onboarding for all flows i.e., if you create a new wallet or import stronghold
            // When this component mounts, ensure that the profile is persisted in the local storage.
            saveProfile($newProfile)
            setActiveProfile($newProfile.id)

            profileInProgress.set(undefined)
            newProfile.set(null)
        } else {
            if ($walletSetupType === SetupType.TrinityLedger) {
                localizedBody = 'trinityLedgerBody'
                localizedValues = { legacy: LedgerAppName.IOTALegacy }

                updateProfile('ledgerMigrationCount', $activeProfile.ledgerMigrationCount + 1)
            } else {
                localizedBody = 'softwareMigratedBody'
            }
        }
    })

    const fiatbalance = formatCurrency(
        convertToFiat(
            // Only show actually migrated balance to user
            $totalMigratedBalance,
            get(currencies)[CurrencyTypes.USD],
            get(exchangeRates)[AvailableExchangeRates.USD]
        ),
        AvailableExchangeRates.USD
    )

    const handleContinueClick = (): void => {
        if (wasMigrated) {
            const _continue = () => {
                if ($walletSetupType === SetupType.TrinityLedger) {
                    /**
                     * We check for the new Ledger IOTA app to be connected after migration
                     * because the last app the user had open was the legacy one
                     */
                    promptUserToConnectLedger(false, () => $appRouter.next())
                } else {
                    $appRouter.next()
                }
            }
            const _exportMigrationLog = () => {
                if ($mobile) {
                    Platform.exportMigrationLog(
                        `${JSON.stringify(migrationLog)}`,
                        `${$activeProfile.id}-${LOG_FILE_NAME}`
                    )
                        .then((result) => {
                            if (result) {
                                logExported = true
                                _continue()
                            }
                        })
                        .catch(console.error)
                } else {
                    getProfileDataPath($activeProfile.id)
                        .then((source) =>
                            $walletSetupType === SetupType.TrinityLedger
                                ? Platform.exportLedgerMigrationLog(
                                      $migrationLog,
                                      `${$activeProfile.id}-${LOG_FILE_NAME}`
                                  )
                                : Platform.exportMigrationLog(
                                      `${source}/${LOG_FILE_NAME}`,
                                      `${$activeProfile.id}-${LOG_FILE_NAME}`
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
            }
            if (logExported) {
                _continue()
            } else {
                _exportMigrationLog()
            }
        } else {
            $appRouter.next()
        }
    }

    onDestroy(() => {
        if (wasMigrated) {
            resetMigrationState()
        }
        $ledgerRouter.reset()
    })
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content" class:w-full={$mobile} style={$mobile ? 'min-height: 40vh;' : ''}>
        {#if wasMigrated}
            <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-2xl mt-10 p-10 pb-6">
                <div
                    class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center shadow-green"
                >
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mt-3 mb-6 text-center">{locale('views.congratulations.fundsMigrated')}</Text>
                <Text type="p" secondary classes="mb-6 text-center">
                    {locale(`views.congratulations.${localizedBody}`, { values: localizedValues })}
                </Text>
                <Text type="h2">{formatUnitBestMatch($totalMigratedBalance, true, 3)}</Text>
                <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
            </div>
        {:else}
            <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-2xl mt-10 p-10 pb-6">
                <div
                    class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center shadow-green"
                >
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mt-3 mb-5 text-center">{locale('views.congratulations.title')}</Text>
                <Text type="p" secondary classes="mb-2 text-center"
                    >{locale(`views.congratulations.${localizedBody}`)}</Text
                >
            </div>
        {/if}
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={handleContinueClick}>
            {locale(
                `${wasMigrated && !logExported ? 'views.congratulations.exportMigration' : 'actions.exploreWallet'}`
            )}
        </Button>
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden ' : 'bg-pastel-yellow dark:bg-gray-900'}"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}"
            animation="butterfly-chrysalis"
        />
    </div>
</OnboardingLayout>

<style>
    .shadow-green {
        box-shadow: 0px 4px 8px rgba(97, 232, 132, 0.3);
    }
</style>
