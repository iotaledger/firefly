<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { OnboardingLayout } from '@components'
    import { restoreBackupFromStrongholdFile, updateOnboardingProfile } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { CLIENT_ERROR_REGEXES, ClientError } from '@core/error'
    import { localize } from '@core/i18n'
    import { Animation, Button, PasswordInput, Text } from '@ui'
    import { onMount } from 'svelte'
    import { restoreFromStrongholdRouter } from '../restore-from-stronghold-router'

    export let error = ''
    export let busy = false

    let strongholdPassword = ''
    $: strongholdPassword, (error = '')

    async function onContinueClick(): Promise<void> {
        if (strongholdPassword) {
            busy = true
            try {
                await restoreBackupFromStrongholdFile(strongholdPassword)
                updateOnboardingProfile({ strongholdPassword, timeStrongholdLastUnlocked: new Date() })
                $restoreFromStrongholdRouter.next()
            } catch (err) {
                if (CLIENT_ERROR_REGEXES[ClientError.InvalidStrongholdPassword].test(err?.error)) {
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
            $restoreFromStrongholdRouter.previous()
        }
    }

    onMount(() => {
        updateOnboardingProfile({ strongholdPassword: undefined, lastStrongholdBackupTime: undefined })
    })
</script>

<OnboardingLayout {onBackClick} {busy}>
    <div slot="title">
        <Text type="h2" classes="mb-4">
            {`${localize('general.import')} ${localize('general.stronghold')}`}
        </Text>
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
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
