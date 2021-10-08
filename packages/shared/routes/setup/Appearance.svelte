<script lang="typescript">
    import { Animation, Button, ButtonRadio, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { createEventDispatcher, onMount } from 'svelte'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const BLINK_SEGMENTS = [[1, 200]]
    const SWITCH_SEGMENTS = [
        [200, 239],
        [1, 200],
    ]

    let darkModeEnabled = $appSettings.darkMode

    let _clonedVariable = undefined
    let segments = BLINK_SEGMENTS

    $: $appSettings.darkMode = darkModeEnabled

    $: if (_clonedVariable !== undefined && _clonedVariable !== darkModeEnabled) {
        _clonedVariable = darkModeEnabled // ghetto reactive implementation
        segments = SWITCH_SEGMENTS
    }

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }

    onMount(() => {
        _clonedVariable = darkModeEnabled
    })
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.appearance.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes={$mobile ? 'mb-4' : 'mb-8'}>{locale('views.appearance.body')}</Text>
        <Text type="p" secondary classes="mb-2" smaller>{locale('general.appearance')}</Text>
        <ButtonRadio icon="theme-light" value={false} bind:group={darkModeEnabled}>{locale('general.lightTheme')}</ButtonRadio>
        <ButtonRadio icon="theme-dark" value={true} bind:group={darkModeEnabled}>{locale('general.darkTheme')}</ButtonRadio>
    </div>
    <div slot="leftpane__action">
        <Button onClick={() => handleContinueClick()} classes="w-full">{locale('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="appearance-desktop" {segments} />
    </div>
</OnboardingLayout>
