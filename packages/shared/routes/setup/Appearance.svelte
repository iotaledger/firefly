<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, ButtonRadio, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings, shouldBeDarkMode } from 'shared/lib/appSettings'
    import { Locale } from '@core/i18n'
    import { appRouter } from '@core/router'

    export let locale: Locale

    const BLINK_SEGMENTS = [[1, 200]]
    const SWITCH_SEGMENTS = [
        [200, 239],
        [1, 200],
    ]

    let _clonedVariable = undefined
    let segments = BLINK_SEGMENTS
    let appTheme = $appSettings.theme

    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
    $: if (_clonedVariable !== undefined && _clonedVariable !== appTheme) {
        _clonedVariable = appTheme // ghetto reactive implementation
        segments = SWITCH_SEGMENTS
    }

    function handleContinueClick(): void {
        $appRouter.next()
    }
    function handleBackClick(): void {
        $appRouter.previous()
    }

    onMount(() => {
        _clonedVariable = appTheme
    })
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.appearance.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes={$mobile ? 'mb-4' : 'mb-8'}>{locale('views.appearance.body')}</Text>
        <Text type="p" secondary classes="mb-2" smaller={!$mobile}>{locale('general.appearance')}</Text>
        <ButtonRadio icon="theme-light" value={'light'} bind:group={appTheme}>
            {locale('general.lightTheme')}
        </ButtonRadio>
        <ButtonRadio icon="theme-dark" value={'dark'} bind:group={appTheme}>{locale('general.darkTheme')}</ButtonRadio>
        <ButtonRadio icon="settings" value={'system'} bind:group={appTheme}>
            {locale('general.systemTheme')}
        </ButtonRadio>
    </div>
    <div slot="leftpane__action">
        <Button onClick={() => handleContinueClick()} classes="w-full">{locale('actions.continue')}</Button>
    </div>
    <div
        slot="rightpane"
        class="animation w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}"
            animation="appearance-desktop"
            {segments}
        />
    </div>
</OnboardingLayout>

<style type="text/scss">
    .animation {
        max-height: calc(100vh - 460px);
        @screen md {
            max-height: inherit;
        }
    }
</style>
