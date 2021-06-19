<script lang="typescript">
    import { Animation, Button, ButtonRadio, OnboardingLayout, Text } from 'shared/components'
    import { appSettings, AppTheme, shouldBeDarkMode } from 'shared/lib/appSettings'
    import { createEventDispatcher, onMount } from 'svelte'

    export let locale
    export let mobile

    const BLINK_SEGMENTS = [[1, 200]]
    const SWITCH_SEGMENTS = [
        [200, 239],
        [1, 200],
    ]

    let _clonedVariable = undefined
    let segments = BLINK_SEGMENTS

    let appTheme: AppTheme = $appSettings.theme
    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)

    $: if (_clonedVariable !== undefined && _clonedVariable !== appTheme) {
        _clonedVariable = appTheme // ghetto reactive implementation
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
        _clonedVariable = appTheme
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.appearance.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.appearance.body')}</Text>
            <Text type="p" secondary classes="mb-2 mt-4" smaller>{locale('general.appearance')}</Text>
            <ButtonRadio icon="theme-light" value={'light'} bind:group={appTheme}>{locale('general.lightTheme')}</ButtonRadio>
            <ButtonRadio icon="theme-dark" value={'dark'} bind:group={appTheme}>{locale('general.darkTheme')}</ButtonRadio>
            <ButtonRadio icon="theme-light" value={'system'} bind:group={appTheme}>{locale('general.systemTheme')}</ButtonRadio>
        </div>
        <div slot="leftpane__action">
            <Button onClick={() => handleContinueClick()} classes="w-full">{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-orange dark:bg-gray-900">
            <Animation animation="appearance-desktop" {segments} />
        </div>
    </OnboardingLayout>
{/if}
