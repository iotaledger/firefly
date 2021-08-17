<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import {
        AvailableExchangeRates,
        convertToFiat,
        currencies,
        CurrencyTypes,
        exchangeRates,
        formatCurrency,
    } from 'shared/lib/currency'
    import { Electron } from 'shared/lib/electron'
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
    import { resetLedgerRoute, walletSetupType } from 'shared/lib/router'
    import { LedgerAppName } from 'shared/lib/typings/ledger'
    import { SetupType } from 'shared/lib/typings/routes'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { getStoragePath } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    const { didComplete } = $migration

    let wasMigrated = $didComplete

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

    const dispatch = createEventDispatcher()

    let fiatbalance = formatCurrency(
        convertToFiat(
            // Only show actually migrated balance to user
            $totalMigratedBalance,
            get(currencies)[CurrencyTypes.USD],
            get(exchangeRates)[AvailableExchangeRates.USD]
        ),
        AvailableExchangeRates.USD
    )

    const handleContinueClick = () => {
        if (wasMigrated) {
            const _continue = () => {
                if ($walletSetupType === SetupType.TrinityLedger) {
                    /**
                     * We check for the new Ledger IOTA app to be connected after migration
                     * because the last app the user had open was the legacy one
                     */
                    promptUserToConnectLedger(false, () => dispatch('next'))
                } else {
                    dispatch('next')
                }
            }
            const _exportMigrationLog = () => {
                Electron.getUserDataPath()
                    .then((path) => {
                        const source = getStoragePath(path, $activeProfile.name)

                        return $walletSetupType === SetupType.TrinityLedger
                            ? Electron.exportLedgerMigrationLog(
                                  $migrationLog,
                                  `${$activeProfile.name}-${LOG_FILE_NAME}`
                              )
                            : Electron.exportMigrationLog(
                                  `${source}/${LOG_FILE_NAME}`,
                                  `${$activeProfile.name}-${LOG_FILE_NAME}`
                              )
                    })
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
            dispatch('next')
        }
    }

    onDestroy(() => {
        if (wasMigrated) {
            resetMigrationState()
        }
        resetLedgerRoute()
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            {#if wasMigrated}
                <div
                    class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6"
                >
                    <div class="bg-green-100 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                        <Icon icon="success-check" classes="text-white" />
                    </div>
                    <Text type="h2" classes="mb-6 text-center">{locale('views.congratulations.fundsMigrated')}</Text>
                    <Text type="p" secondary classes="mb-6 text-center">
                        {locale(`views.congratulations.${localizedBody}`, { values: localizedValues })}
                    </Text>
                    <Text type="h2">{formatUnitBestMatch($totalMigratedBalance, true, 3)}</Text>
                    <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
                </div>
            {:else}
                <div
                    class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6"
                >
                    <div class="bg-green-100 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                        <Icon icon="success-check" classes="text-white" />
                    </div>
                    <Text type="h2" classes="mb-5 text-center">{locale('views.congratulations.title')}</Text>
                    <Text type="p" secondary classes="mb-2 text-center"
                        >{locale(`views.congratulations.${localizedBody}`)}</Text
                    >
                </div>
            {/if}
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>
                {locale(
                    `${wasMigrated && !logExported ? 'views.congratulations.exportMigration' : 'actions.finishSetup'}`
                )}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Animation animation="congratulations-desktop" />
        </div>
    </OnboardingLayout>
{/if}
