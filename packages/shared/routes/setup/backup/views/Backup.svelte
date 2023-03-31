<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { createEventDispatcher } from 'svelte'
    import { Locale } from '@core/i18n'

    export let locale: Locale
    export let busy

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{locale('views.backup.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{locale('views.backup.body1')}</Text>
        <Text type="p" secondary classes="mb-4">{locale('views.backup.body2')}</Text>
        <Text type="p" secondary highlighted classes="mb-4 font-bold">{locale('views.backup.body3')}</Text>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={handleContinueClick} autofocus={!$mobile}>{locale('actions.continue')}</Button
        >
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}"
            animation="backup-desktop"
        />
    </div>
</OnboardingLayout>
