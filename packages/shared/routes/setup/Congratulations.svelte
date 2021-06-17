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
    import { LOG_FILE_NAME, migration, resetMigrationState, totalMigratedBalance } from 'shared/lib/migration'
    import { activeProfile, newProfile, profileInProgress, saveProfile, setActiveProfile } from 'shared/lib/profile'
    import { walletSetupType } from 'shared/lib/router'
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
            Electron.getUserDataPath()
                .then((path) => {
                    const source = getStoragePath(path, $activeProfile.name)

                    return Electron.exportMigrationLog(`${source}/${LOG_FILE_NAME}`, `${$activeProfile.name}-${LOG_FILE_NAME}`)
                })
                .then((result) => {
                    if (result) {
                        dispatch('next')
                    }
                })
                .catch(console.error)
        } else {
            dispatch('next')
        }
    }

    onDestroy(() => {
        if (wasMigrated) {
            resetMigrationState()
        }
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            {#if wasMigrated}
                <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
                    <div class="bg-green-100 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                        <Icon icon="success-check" classes="text-white" />
                    </div>
                    <Text type="h2" classes="mb-6 text-center">{locale('views.congratulations.fundsMigrated')}</Text>
                    <Text type="p" secondary classes="mb-6 text-center">{locale(`views.congratulations.${localizedBody}`)}</Text>
                    <Text type="h2">{formatUnitBestMatch($totalMigratedBalance, true, 3)}</Text>
                    <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
                </div>
            {:else}
                <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
                    <div class="bg-green-100 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                        <Icon icon="success-check" classes="text-white" />
                    </div>
                    <Text type="h2" classes="mb-5 text-center">{locale('views.congratulations.title')}</Text>
                    <Text type="p" secondary classes="mb-2">{locale(`views.congratulations.${localizedBody}`)}</Text>
                </div>
            {/if}
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>
                {locale(`${wasMigrated ? 'views.congratulations.exportMigration' : 'actions.finishSetup'}`)}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Animation animation="congratulations-desktop" />
        </div>
    </OnboardingLayout>
{/if}
