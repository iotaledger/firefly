<script lang="typescript">
    import { Animation, Button, OnboardingLayout, PasswordInput, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileBackupRouter } from '@core/router'
    import { backupInitialStronghold, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { HTMLButtonType } from 'shared/components/Button.svelte'

    export let busy = false

    let confirmPassword = ''
    let skipBackup = false

    $: isStrongholdPasswordValid = $onboardingProfile?.strongholdPassword === confirmPassword

    async function onAdvanceView(): Promise<void> {
        if (!skipBackup) {
            await backupInitialStronghold()
        }

        updateOnboardingProfile({ mnemonic: null })

        $profileBackupRouter.next()
    }

    async function onSkipBackupClick(): Promise<void> {
        skipBackup = true
        await onAdvanceView()
    }

    async function onBackupClick(): Promise<void> {
        if (isStrongholdPasswordValid) {
            try {
                skipBackup = false
                await onAdvanceView()
            } catch (err) {
                console.error(err)
            }
        }
    }

    function onBackClick(): void {
        if ($onboardingProfile?.recoveryType) {
            $profileBackupRouter.previous()
        } else {
            $profileBackupRouter.reset()
        }
    }
</script>

<OnboardingLayout {onBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileBackup.backupStronghold.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <form on:submit|preventDefault={onBackupClick} id="backup-form">
            <Text type="p" secondary classes="mb-8"
                >{localize('views.onboarding.profileBackup.backupStronghold.body1')}</Text
            >
            <PasswordInput bind:value={confirmPassword} autofocus disabled={busy} showRevealToggle classes="mb-8" />
            <Text type="p" secondary classes="mb-4"
                >{localize('views.onboarding.profileBackup.backupStronghold.body2')}</Text
            >
            <Text type="p" secondary smaller classes="mb-2"
                >- {localize('views.onboarding.profileBackup.backupStronghold.reason1')}</Text
            >
            <Text type="p" secondary smaller classes="mb-2"
                >- {localize('views.onboarding.profileBackup.backupStronghold.reason2')}</Text
            >
            <Text type="p" secondary smaller classes="mb-2"
                >- {localize('views.onboarding.profileBackup.backupStronghold.reason3')}</Text
            >
        </form>
    </div>
    <div slot="leftpane__action">
        <Button
            outline
            classes="w-full mb-4"
            disabled={busy}
            onClick={onSkipBackupClick}
            isBusy={skipBackup && busy}
            busyMessage={localize('general.creatingProfile')}
        >
            {localize('actions.skipBackup')}
        </Button>
        <Button
            type={HTMLButtonType.Submit}
            form="backup-form"
            classes="w-full"
            disabled={!isStrongholdPasswordValid || busy}
            isBusy={!skipBackup && busy}
            busyMessage={localize('general.creatingProfile')}
        >
            {localize('actions.saveBackup')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="backup-recovery-phrase-desktop" />
    </div>
</OnboardingLayout>
