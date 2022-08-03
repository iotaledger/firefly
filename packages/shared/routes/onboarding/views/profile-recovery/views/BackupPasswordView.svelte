<script lang="typescript">
    import { getContext } from 'svelte'
    import { Animation, Button, OnboardingLayout, PasswordInput, Spinner, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter, ProfileRecoveryRouter } from '@core/router'
    import {
        restoreBackupFromFile,
        isGettingMigrationData,
        iotaProfileManager,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    export let error = ''
    export let busy = false

    const { importFile } = getContext<ProfileRecoveryRouter>('importRouter')

    let strongholdPassword = ''

    async function handleContinue(): Promise<void> {
        if (strongholdPassword) {
            try {
                await restoreBackupFromFile(importFile, strongholdPassword)

                if ($iotaProfileManager) {
                    await $iotaProfileManager.restoreBackup($onboardingProfile?.importFilePath, strongholdPassword)
                }

                updateOnboardingProfile({ strongholdPassword })
                $profileRecoveryRouter.next()
            } catch (err) {
                console.error(err)
                error = localize('error.password.incorrect')
            }
        }
    }

    function handleBackClick(): void {
        // We are deliberately using "isGettingMigrationData"
        // We do not want to display the spinner if stronghold is being imported.
        if (!busy && !$isGettingMigrationData) {
            $profileRecoveryRouter.previous()
        }
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        {#if $mobile}
            <Text type="h2" classes="mb-4">
                {`${localize('general.import')} ${localize(`general.${$onboardingProfile?.recoveryType}`)}`}
            </Text>
        {:else}
            <Text type="h2" classes="mb-4">{localize('general.import')}</Text>
            <Text type="h3" highlighted>{localize(`general.${$onboardingProfile?.recoveryType}`)}</Text>
        {/if}
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.importBackupPassword.body1')}</Text>
        <Text type="p" secondary classes="mb-8">{localize('views.importBackupPassword.body2')}</Text>
        <PasswordInput
            classes="mb-6"
            {error}
            bind:value={strongholdPassword}
            showRevealToggle
            autofocus
            disabled={busy}
            submitHandler={handleContinue}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button
            classes="flex-1"
            disabled={strongholdPassword.length === 0 || busy || $isGettingMigrationData}
            onClick={handleContinue}
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
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
