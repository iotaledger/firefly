<script lang="typescript">
    import { AppRoute, appRouter } from '@core/router'
    import { Animation, Button, Checkbox, Dropdown, Logo, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings, isAwareOfCrashReporting } from 'shared/lib/appSettings'
    import { SUPPORTED_LOCALES, setLanguage, _ } from '@core/i18n'
    import { Locale } from '@core/i18n'
    import { backButtonStore } from '@core/router'
    import { lastAcceptedTos, lastAcceptedPrivacyPolicy } from 'shared/lib/appSettings'
    import { TOS_VERSION, PRIVACY_POLICY_VERSION } from 'shared/lib/app'

    export let locale: Locale

    let checked = false
    let sendCrashReports = false

    $: languageList = Object.values(SUPPORTED_LOCALES).map((locale) => ({ value: locale, label: locale }))

    $backButtonStore.reset()

    function handleContinueClick(): void {
        if ($mobile) {
            lastAcceptedTos.set(TOS_VERSION)
            lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
            appSettings.set({ ...$appSettings, sendCrashReports })
            if (!$isAwareOfCrashReporting) {
                isAwareOfCrashReporting.set(true)
            }
        }
        $appRouter.next()
    }

    function handleLegalClick(): void {
        $appRouter.goTo(AppRoute.Legal)
    }

    function handleLanguage(item: { value: string }): void {
        setLanguage(item)
        locale = $_
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content" class={$mobile && 'px-4'}>
        <div class="flex flex-col {$mobile && 'items-center text-center px-10'} space-y-4 mb-8">
            {#if !$mobile}
                <Logo width="64px" logo="logo-firefly" classes="mb-6" />
            {/if}
            <Text type={$mobile ? 'h3' : 'h1'}>{locale('views.onboarding1.title')}</Text>
            {#if !$mobile}
                <Text type="p" secondary>{locale('views.onboarding1.body')}</Text>
            {/if}
        </div>
        {#if $mobile}
            <div class="flex flex-col space-y-2 mb-8">
                <div class="flex flex-row items-center space-x-3 mb-1">
                    <Checkbox bind:checked />
                    <Text type="p" secondary>
                        {locale('views.legal.checkboxMobile')}
                        <span on:click={handleLegalClick} class="text-blue-500">
                            {locale('views.legal.title')}
                        </span>
                    </Text>
                </div>
                <Checkbox label={locale('views.crashReporting.checkbox')} bind:checked={sendCrashReports} />
                <!-- <div class="languages flex flex-wrap space-y-2 overflow-y-auto">
                    {#each languageList as language}
                        <button
                            class="relative flex items-center p-2 w-full whitespace-nowrap rounded-md"
                            on:click={() => handleLanguage(language)}
                            class:active={language?.label === SUPPORTED_LOCALES[$appSettings.language]}
                        >
                            <Text type="p" smaller>{language?.label}</Text>
                        </button>
                    {/each}
                </div> 
            TODO use window.navigator.language to autodetect locale-->
            </div>
        {:else}
            <Dropdown
                sortItems={true}
                onSelect={handleLanguage}
                value={SUPPORTED_LOCALES[$appSettings.language]}
                items={languageList}
            />
        {/if}
    </div>
    <div slot="leftpane__action" class={$mobile && 'px-4'}>
        <Button onClick={() => handleContinueClick()} classes="w-full" disabled={!checked}
            >{locale('actions.continue')}</Button
        >
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden' : 'bg-pastel-blue dark:bg-gray-900'}"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? '-mr-52 transform scale-180' : ''}"
            animation="welcome-desktop"
        />
    </div>
</OnboardingLayout>

<style type="text/scss">
    .languages {
        max-height: calc(100vh - 100vw - 150px);
        @screen md {
            max-height: inherit;
        }
        button {
            &.active {
                @apply bg-blue-500;
                @apply bg-opacity-10;
                :global(p) {
                    @apply text-blue-500;
                }
            }
        }
    }
</style>
