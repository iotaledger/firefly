<script lang="typescript">
    import { Button, PasswordInput, Text, TextType, HTMLButtonType } from 'shared/components'
    import { OnboardingLayout } from '../../../../../components'
    import { localize } from '@core/i18n'
    import { profileBackupRouter } from '../../../../../lib/routers'
    import { backupInitialStronghold, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'

    export let busy = false

    let confirmPassword = ''
    let skipBackup = false
    let title = localize('views.onboarding.profileBackup.backupStronghold.title')

    $: isStrongholdPasswordValid = $onboardingProfile?.strongholdPassword === confirmPassword

    async function onAdvanceView(): Promise<void> {
        if (!skipBackup) {
            await backupInitialStronghold()
        }

        updateOnboardingProfile({ mnemonic: null, strongholdPassword: null, importFile: null, importFilePath: null })

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

<OnboardingLayout {onBackClick} {busy} {title} animation="backup-recovery-phrase-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary classes="mb-8"
            >{localize('views.onboarding.profileBackup.backupStronghold.body1')}</Text
        >
        <form on:submit|preventDefault={onBackupClick} id="backup-form">
            <PasswordInput bind:value={confirmPassword} autofocus disabled={busy} showRevealToggle classes="mb-8" />
        </form>
        <Text type={TextType.p} secondary smaller classes="mb-2"
            >- {localize('views.onboarding.profileBackup.backupStronghold.reason1')}</Text
        >
        <Text type={TextType.p} secondary smaller classes="mb-2"
            >- {localize('views.onboarding.profileBackup.backupStronghold.reason2')}</Text
        >
        <Text type={TextType.p} secondary smaller classes="mb-2"
            >- {localize('views.onboarding.profileBackup.backupStronghold.reason3')}</Text
        >
    </div>
    <div slot="footer">
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
</OnboardingLayout>
