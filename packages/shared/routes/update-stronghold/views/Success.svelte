<script lang="typescript">
    import { Locale } from '@core/i18n'
    import { SetupType } from '@lib/typings/setup'
    import { Button, Icon, OnboardingLayout, Text, TextHint } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { showAppNotification } from 'shared/lib/notifications'
    import { Platform } from 'shared/lib/platform'
    import { updateProfile } from 'shared/lib/profile'
    import { getDefaultStrongholdName } from 'shared/lib/utils'
    import { api, walletSetupType } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'

    export let locale: Locale
    export let currentPassword: string = ''
    export let allowBack: boolean = false
    export let enforceBackup: boolean = false

    let busy: boolean = false

    const dispatch = createEventDispatcher()

    $: strongholdImport = $walletSetupType === SetupType.Stronghold

    function handleContinueClick(): void {
        busy = true
        Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
            .then((result) => {
                if (result) {
                    Platform.saveStrongholdBackup({ allowAccess: true })
                    api.backup(result, currentPassword, {
                        onSuccess() {
                            Platform.saveStrongholdBackup({ allowAccess: false })
                            updateProfile('lastStrongholdBackupTime', new Date())
                            dispatch('next')
                        },
                        onError(err) {
                            showAppNotification({
                                type: 'error',
                                message: locale(err.error),
                            })
                            busy = false
                        },
                    })
                } else {
                    busy = false
                }
            })
            .catch((err) => {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
                busy = false
            })
    }

    function handleSkipClick(): void {
        dispatch('next')
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {allowBack}>
    <div slot="leftpane__content" class:w-full={$mobile} style={$mobile ? 'min-height: 60vh;' : ''}>
        <div
            class="relative flex flex-col items-center text-center bg-gray-100 dark:bg-gray-800 rounded-2xl mt-10 p-10 pb-6"
        >
            <div
                class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center shadow-green"
            >
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type="h2" classes="mb-5 text-center"
                >{strongholdImport
                    ? locale('views.importSuccess.title')
                    : locale('views.updateStronghold.success.title')}</Text
            >
            <Text type="p" secondary classes="mb-2"
                >{strongholdImport
                    ? locale('views.importSuccess.body')
                    : locale('views.updateStronghold.success.body')}</Text
            >
        </div>
        <TextHint
            hint={locale('views.updateStronghold.success.hint')}
            icon="exclamation"
            classes="my-4 p-4 w-full rounded-2xl bg-yellow-50 dark:bg-opacity-10"
            iconClasses="text-yellow-700"
        />
    </div>
    <div slot="leftpane__action">
        {#if !enforceBackup}
            <Button secondary classes="w-full mb-4" onClick={handleSkipClick}>
                {locale('actions.skipBackup')}
            </Button>
        {/if}
        <Button classes="w-full" onClick={handleContinueClick}>
            {locale('actions.saveBackup')}
        </Button>
    </div>
</OnboardingLayout>
