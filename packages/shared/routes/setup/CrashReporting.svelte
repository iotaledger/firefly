<script lang="typescript">
    import { Animation, Button, Checkbox, OnboardingLayout, Text } from 'shared/components'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'
    import { appSettings, isAwareOfCrashReporting } from 'shared/lib/appSettings'

    export let locale: Locale

    const busy = false
    let sendCrashReports = true

    const dispatch = createEventDispatcher()

    const handleBackClick = () => {
        dispatch('previous')
    }

    const handleContinueClick = () => {
        appSettings.set({ ...get(appSettings), sendCrashReports })

        if (!$isAwareOfCrashReporting) {
            isAwareOfCrashReporting.set(true)
        }

        dispatch('next')
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
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-orange dark:bg-gray-900">
        <Animation animation="secure-desktop" />
    </div>
</OnboardingLayout>
