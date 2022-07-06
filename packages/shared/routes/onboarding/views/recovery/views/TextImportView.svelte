<script lang="typescript">
    import { Animation, Button, ImportTextfield, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { recoveryRouter } from '@core/router'
    import { profileRecoveryType, isGettingMigrationData, mnemonic } from '@contexts/onboarding'

    let input = ''

    function handleSubmit(): void {
        mnemonic.set(input.split(' '))
        $recoveryRouter.next({ migrationSeed: input })
    }

    function handleBackClick(): void {
        if (!$isGettingMigrationData) {
            profileRecoveryType.set(null)
            $recoveryRouter.previous()
        }
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize(`views.importFromText.${$profileRecoveryType}.title`)}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize(`views.importFromText.${$profileRecoveryType}.body`)}</Text>
        <Text type="h5" classes="mb-3">{localize(`views.importFromText.${$profileRecoveryType}.enter`)}</Text>
        <form on:submit={handleSubmit} id="text-import-form">
            <ImportTextfield disabled={$isGettingMigrationData} type={$profileRecoveryType} bind:value={input} />
        </form>
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button
            type="submit"
            form="text-import-form"
            classes="flex-1"
            disabled={input.length === 0 || $isGettingMigrationData}
        >
            {#if $isGettingMigrationData}
                <Spinner
                    busy={$isGettingMigrationData}
                    message={localize('views.migrate.restoringWallet')}
                    classes="justify-center"
                />
            {:else}{localize('actions.continue')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-text-desktop" />
    </div>
</OnboardingLayout>
