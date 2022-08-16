<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, ButtonRadio, Dropdown, OnboardingLayout, Text } from 'shared/components'
    import { appSettings, AppTheme, mobile, shouldBeDarkMode } from '@core/app'
    import { Locale, setLanguage, SUPPORTED_LOCALES } from '@core/i18n'
    import { appSetupRouter } from '@core/router'
    import type { DropdownChoice } from '@core/utils'
    import {
        initialiseOnboardingProfile,
        onboardingProfile,
        shouldUseDeveloperProfile,
    } from '../../../../../lib/contexts/onboarding'

    /**
     * NOTE: It is necessary to use locale directly rather than the
     * localize function because this components must be reactive towards
     * the language.
     */
    export let locale: Locale

    const BLINK_SEGMENTS = [[1, 200]]
    const SWITCH_SEGMENTS = [
        [200, 239],
        [1, 200],
    ]

    let _clonedVariable = undefined
    let segments = BLINK_SEGMENTS
    let appTheme = $appSettings.theme ?? AppTheme.Light

    let languageList: DropdownChoice[]
    $: languageList = Object.values(SUPPORTED_LOCALES).map((locale) => ({ value: locale, label: locale }))

    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
    $: if (_clonedVariable !== undefined && _clonedVariable !== appTheme) {
        _clonedVariable = appTheme // ghetto reactive implementation
        segments = SWITCH_SEGMENTS
    }

    function onLanguageSelectionClick(item: DropdownChoice): void {
        setLanguage(item)
    }

    function onContinueClick(): void {
        $appSetupRouter.next()
    }

    function onBackClick(): void {
        $appSetupRouter.previous()
    }

    onMount(() => {
        _clonedVariable = appTheme
        initialiseOnboardingProfile($onboardingProfile?.isDeveloperProfile ?? shouldUseDeveloperProfile())
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.onboarding.appSetup.languageAndAppearance.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes={$mobile ? 'mb-4' : 'mb-8'}
            >{locale('views.onboarding.appSetup.languageAndAppearance.body')}</Text
        >
        {#if $mobile}
            <div class="languages flex flex-wrap space-y-2 overflow-y-auto">
                {#each languageList as language}
                    <button
                        class="relative flex items-center p-2 w-full whitespace-nowrap rounded-md"
                        on:click={() => onLanguageSelectionClick(language)}
                        class:active={language?.label === SUPPORTED_LOCALES[$appSettings.language]}
                    >
                        <Text type="p" smaller>{language?.label}</Text>
                    </button>
                {/each}
            </div>
        {:else}
            <div class="mb-8 flex flex-col">
                <Text type="p" secondary classes="mb-2" smaller>{locale('general.language')}</Text>
                <Dropdown
                    sortItems
                    onSelect={onLanguageSelectionClick}
                    value={SUPPORTED_LOCALES[$appSettings.language]}
                    items={languageList}
                />
            </div>
        {/if}

        <Text type="p" secondary classes="mb-2" smaller>{locale('general.appearance')}</Text>
        <ButtonRadio icon="theme-light" value={'light'} bind:group={appTheme}>
            {locale('general.lightTheme')}
        </ButtonRadio>
        <ButtonRadio icon="theme-dark" value={'dark'} bind:group={appTheme}>{locale('general.darkTheme')}</ButtonRadio>
        <ButtonRadio icon="settings" value={'system'} bind:group={appTheme}>
            {locale('general.systemTheme')}
        </ButtonRadio>
    </div>
    <div slot="leftpane__action">
        <Button onClick={onContinueClick} classes="w-full">{locale('actions.continue')}</Button>
    </div>
    <div
        slot="rightpane"
        class="animation w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}"
    >
        <Animation classes="setup-anim-aspect-ratio" animation="appearance-desktop" {segments} />
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
