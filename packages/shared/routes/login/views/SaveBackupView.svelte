<script lang="ts">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { updateStrongholdRouter } from '@core/router'

    const busy = false

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }

    function onSkipBackupClick(): void {
        $updateStrongholdRouter.next()
    }

    function onSaveBackupClick(): void {
        $updateStrongholdRouter.next()
    }
</script>

<save-backup-view>
    <OnboardingLayout {onBackClick} {busy}>
        <div slot="title">
            <Text type="h2" classes="mb-5">{localize('views.login.saveBackup.title')}</Text>
        </div>
        <div slot="leftpane__content">
            <Text type="p" secondary classes="mb-8">{localize('views.login.saveBackup.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" secondary onClick={onSkipBackupClick}>
                {localize('actions.skipWalletBackup')}
            </Button>
            <Button classes="w-full mt-6" onClick={onSaveBackupClick}>
                {localize('actions.saveStrongholdBackupLocally')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-orange dark:bg-gray-900">
            <Animation animation="congratulations-desktop" />
        </div>
    </OnboardingLayout>
</save-backup-view>
