<script lang="typescript">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { Button, PasswordInput, Text, TextType } from '@ui'

    import { showAppNotification } from '@auxiliary/notification'
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
    import { CLIENT_ERROR_REGEXES, ClientError } from '@core/error'
    import { localize } from '@core/i18n'

    import { profileRecoveryRouter } from '@/routers'

    export let error = ''
    export let busy = false

    const title = `${localize('general.import')} ${localize(`general.${$onboardingProfile?.recoveryType}`)}`

    let strongholdPassword = ''
    $: strongholdPassword, (error = '')

    onMount(() => {
        updateOnboardingProfile({ strongholdPassword: null, lastStrongholdBackupTime: null })
    })

    async function onContinueClick(): Promise<void> {
        if (strongholdPassword) {
            busy = true
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
                } else if (CLIENT_ERROR_REGEXES[ClientError.InvalidStrongholdPassword].test(err?.error)) {
                    error = localize('error.password.incorrect')
                } else {
                    console.error(err)
                    showAppNotification({
                        type: 'error',
                        alert: true,
                        message: localize('error.global.generic'),
                    })
                }
            } finally {
                busy = false
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
</script>

<OnboardingLayout {onBackClick} {busy} {title} animation="import-from-file-password-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary fontSize="15" classes="mb-4">
            {localize('views.onboarding.profileRecovery.backupPassword.body1')}
        </Text>
        <Text type={TextType.p} secondary fontSize="15" classes="mb-8">
            {localize('views.onboarding.profileRecovery.backupPassword.body2')}
        </Text>
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
    <div slot="footer" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button
            classes="flex-1"
            disabled={strongholdPassword.length === 0 || busy}
            isBusy={busy}
            busyMessage={`${localize('actions.importing')}...`}
            onClick={onContinueClick}
        >
            {localize('actions.continue')}
        </Button>
    </div>
</OnboardingLayout>
