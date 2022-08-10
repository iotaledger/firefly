<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, PasswordInput, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter } from '@core/router'
    import { restoreBackupFromStrongholdFile, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'

    export let error = ''
    export let busy = false

    let strongholdPassword = ''

    async function onContinueClick(): Promise<void> {
        if (strongholdPassword) {
            try {
                await restoreBackupFromStrongholdFile(strongholdPassword)
                updateOnboardingProfile({ strongholdPassword })
                $profileRecoveryRouter.next()
            } catch (err) {
                console.error(err)
                error = localize('error.password.incorrect')
            }
        }
    }

    function onBackClick(): void {
        // We are deliberately using "isGettingMigrationData"
        // We do not want to display the spinner if stronghold is being imported.
        if (!busy) {
            $profileRecoveryRouter.previous()
        }
    }

    onMount(() => {
        updateOnboardingProfile({ strongholdPassword: null, lastStrongholdBackupTime: null })
    })
</script>

<OnboardingLayout {onBackClick} {busy}>
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
            submitHandler={onContinueClick}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" disabled={strongholdPassword.length === 0 || busy} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
