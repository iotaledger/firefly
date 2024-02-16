<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { showAppNotification } from '@auxiliary/notification'
    import { OnboardingLayout } from '@components'
    import { exportStronghold } from '@contexts/settings/actions'
    import { localize } from '@core/i18n'
    import { login } from '@core/profile/actions'
    import { Animation, Button, Icon, Text, TextHint, TextType } from '@ui'
    import { updateStrongholdRouter } from '@core/router'
    import { TextHintVariant } from '@ui/enums'
    import { AnimationEnum } from '@auxiliary/animation'

    export let busy = false
    export let changedPassword: boolean
    export let isRecovery = false
    export let password: string

    const skipBackup = false

    function onAdvanceView(): void {
        if (!isRecovery) {
            void login()
        }

        $updateStrongholdRouter.next()
    }

    function onSkipBackupClick(): void {
        onAdvanceView()
    }

    async function onBackupClick(): Promise<void> {
        try {
            await exportStronghold(password, handleExportStrongholdResponse)
            onAdvanceView()
        } catch (err) {
            console.error(err)
        }
    }

    function handleExportStrongholdResponse(cancelled: boolean, error: string): void {
        if (!cancelled) {
            if (error) {
                showAppNotification({
                    type: 'error',
                    message: localize(error),
                })
            } else {
                showAppNotification({
                    type: 'info',
                    message: localize('general.exportingStrongholdSuccess'),
                })
            }
        }
    }

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick} {busy} allowBack={!changedPassword}>
    <div slot="leftpane__content">
        <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 mb-6 p-10 pb-6">
            <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon={IconEnum.SuccessCheck} classes="text-white" />
            </div>
            <Text type={TextType.h2} classes="mb-5 text-center">
                {localize(`views.updateStronghold.updateBackup.${isRecovery ? 'recoveryTitle' : 'loginTitle'}`)}
            </Text>
            <Text secondary classes="mb-2 text-center">
                {localize(`views.updateStronghold.updateBackup.${isRecovery ? 'recoveryBody' : 'loginBody'}`)}
            </Text>
        </div>
        <TextHint variant={TextHintVariant.Warning} text={localize('views.updateStronghold.updateBackup.hint')} />
    </div>
    <div slot="leftpane__action">
        <Button
            outline
            classes="w-full mb-4"
            disabled={busy || changedPassword}
            onClick={onSkipBackupClick}
            isBusy={skipBackup && busy}
            busyMessage={localize('general.creatingProfile')}
        >
            {localize('actions.skipBackup')}
        </Button>
        <Button
            classes="w-full"
            disabled={busy}
            isBusy={!skipBackup && busy}
            onClick={onBackupClick}
            busyMessage={localize('general.creatingProfile')}
        >
            {localize('actions.saveBackup')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation animation={AnimationEnum.BackupRecoveryPhraseDesktop} />
    </div>
</OnboardingLayout>
