<script lang="ts">
    import { Animation, Button, Icon, OnboardingLayout, Text, TextHint } from 'shared/components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router/router'

    export let parentRouter: Router<unknown>

    function onSkipBackupClick(): void {
        parentRouter.next()
    }

    function onSaveBackupClick(): void {
        parentRouter.next()
    }
</script>

<save-backup-view>
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
                <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mb-5 text-center">{localize('views.login.saveBackup.title')}</Text>
                <Text type="p" secondary classes="mb-2 text-center">{localize('views.login.saveBackup.body')}</Text>
            </div>
            <TextHint
                hint={localize('views.login.saveBackup.hint')}
                hintClasses="text-gray-700 dark:text-gray-400"
                icon="exclamation"
                classes="mt-8 p-4 w-full rounded-2xl bg-yellow-50 dark:bg-opacity-10"
                iconClasses="text-yellow-700"
            />
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
