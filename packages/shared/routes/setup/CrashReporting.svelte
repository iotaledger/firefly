<script lang="typescript">
    import { Locale } from '@core/i18n'
    import { appRouter } from '@core/router'
    import { Animation, Button, Checkbox, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings, isAwareOfCrashReporting } from 'shared/lib/appSettings'

    export let locale: Locale

    const busy = false
    let sendCrashReports = true

    const handleBackClick = (): void => {
        $appRouter.previous()
    }

    const handleContinueClick = (): void => {
        appSettings.set({ ...$appSettings, sendCrashReports })

        if (!$isAwareOfCrashReporting) {
            isAwareOfCrashReporting.set(true)
        }
        $appRouter.next()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2" classes="mb-5">{locale('views.crashReporting.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{locale('views.crashReporting.body')}</Text>
    </div>
    <div slot="leftpane__action">
        <Checkbox label={locale('views.crashReporting.checkbox')} bind:checked={sendCrashReports} classes="mb-8" />
        <Button classes="w-full" onClick={handleContinueClick}>
            {locale('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-white dark:bg-gray-900">
        <Animation animation="secure-desktop" classes={$mobile ? 'transform scale-120' : ''} />
    </div>
</OnboardingLayout>
