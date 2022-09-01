<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, PasswordInput, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter } from '@core/router'
    import {
        CannotRestoreWithMismatchedCoinTypeError,
        createShimmerClaimingProfileManager,
        destroyShimmerClaimingProfileManager,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        ProfileSetupType,
        restoreBackupForShimmerClaimingProfileManager,
        restoreBackupFromStrongholdFile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { showAppNotification } from '../../../../../lib/notifications'

    export let error = ''
    export let busy = false

    let strongholdPassword = ''
    $: strongholdPassword, (error = '')

    async function onContinueClick(): Promise<void> {
        if (strongholdPassword) {
            try {
                if ($onboardingProfile?.setupType === ProfileSetupType.Claimed) {
                    await restoreBackupForShimmerClaimingProfileManager(strongholdPassword)
                } else {
                    await restoreBackupFromStrongholdFile(strongholdPassword)
                }

                updateOnboardingProfile({ strongholdPassword })
                $profileRecoveryRouter.next()
            } catch (err) {
                if (err instanceof CannotRestoreWithMismatchedCoinTypeError) {
                    await initialiseProfileManagerFromOnboardingProfile(false)

                    if ($onboardingProfile?.setupType === ProfileSetupType.Claimed) {
                        await destroyShimmerClaimingProfileManager()
                        await createShimmerClaimingProfileManager()
                    }
                } else if (err?.error.match(/`invalid stronghold password`/)) {
                    error = localize('error.password.incorrect')
                } else {
                    console.error(err)
                    showAppNotification({
                        type: 'error',
                        alert: true,
                        message: localize('error.global.generic'),
                    })
                }
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
        <Text type="p" secondary classes="mb-4"
            >{localize('views.onboarding.profileRecovery.backupPassword.body1')}</Text
        >
        <Text type="p" secondary classes="mb-8"
            >{localize('views.onboarding.profileRecovery.backupPassword.body2')}</Text
        >
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
