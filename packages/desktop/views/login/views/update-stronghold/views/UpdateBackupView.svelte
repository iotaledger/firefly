<script lang="ts">
    import { Animation, Button, Icon, Text, TextHint, TextType } from '@ui'
    import { OnboardingLayout } from '@components'

    import { localize } from '@core/i18n'
    import { updateStrongholdRouter } from '@core/router'

    import { backupInitialStronghold, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'

    import { Icon as IconEnum } from '@auxiliary/icon'

    export let busy = false

    const confirmPassword = ''
    const skipBackup = false

    $: isStrongholdPasswordValid = $onboardingProfile?.strongholdPassword === confirmPassword

    function onAdvanceView(): void {
        updateOnboardingProfile({ mnemonic: null, strongholdPassword: null, importFile: null, importFilePath: null })

        $updateStrongholdRouter.next()
    }

    function onSkipBackupClick(): void {
        onAdvanceView()
    }

    async function onBackupClick(): Promise<void> {
        if (isStrongholdPasswordValid) {
            try {
                await backupInitialStronghold()
                onAdvanceView()
            } catch (err) {
                console.error(err)
            }
        }
    }

    function onBackClick(): void {
        if ($onboardingProfile?.recoveryType) {
            $updateStrongholdRouter.previous()
        } else {
            $updateStrongholdRouter.reset()
        }
    }
</script>

<OnboardingLayout {onBackClick} {busy}>
    <div slot="leftpane__content">
        <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 mb-6 p-10 pb-6">
            <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon={IconEnum.SuccessCheck} classes="text-white" />
            </div>
            <Text type={TextType.h2} classes="mb-5 text-center">
                {localize('views.updateStronghold.updateBackup.title')}
            </Text>
            <Text secondary classes="mb-2 text-center">
                {localize('views.updateStronghold.updateBackup.body')}
            </Text>
        </div>
        <TextHint warning text={localize('views.updateStronghold.updateBackup.hint')} />
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
            classes="w-full"
            disabled={!isStrongholdPasswordValid || busy}
            isBusy={!skipBackup && busy}
            onClick={onBackupClick}
            busyMessage={localize('general.creatingProfile')}
        >
            {localize('actions.saveBackup')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="backup-recovery-phrase-desktop" />
    </div>
</OnboardingLayout>
