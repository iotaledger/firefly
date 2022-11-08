<script lang="typescript">
    import { onMount } from 'svelte'
    import { localeDirection, setupI18n } from '@core/i18n'
    import { checkAndMigrateProfiles, cleanupEmptyProfiles } from '@core/profile'
    import { AppRoute, initialiseRouters } from './lib/routers'
    import {
        appSettings,
        appStage,
        AppStage,
        AppTheme,
        initAppSettings,
        Platform,
        setPlatform,
        shouldBeDarkMode,
    } from '@core/app'
    import { onboardingProfile } from '@contexts/onboarding'
    import { ToastContainer } from '@ui'
    import { Route } from './components'
    import { isKeyboardOpen, keyboardHeight } from './lib/auxiliary/keyboard'
    import { DashboardView, LoginRouter, OnboardingRouter } from './views'

    appStage.set(AppStage[process.env.STAGE.toUpperCase()] ?? AppStage.ALPHA)

    checkAndMigrateProfiles()

    $: $appSettings.darkMode
        ? document.body.classList.add('scheme-dark')
        : document.body.classList.remove('scheme-dark')

    $: if (document.dir !== $localeDirection) {
        document.dir = $localeDirection
    }

    let splash = true

    void setupI18n({ fallbackLocale: 'en', initialLocale: $appSettings.language })

    onMount(async () => {
        setTimeout(() => {
            splash = false
            initialiseRouters()
        }, 3000)

        initAppSettings.set($appSettings)

        // await pollMarketData()

        /* eslint-disable no-undef */
        // @ts-expect-error: This value is replaced by Webpack DefinePlugin
        // if (!devMode && get(appStage) === AppStage.PROD) {
        //     await setAppVersionDetails()
        //     pollCheckForAppUpdate()
        // }

        await cleanupEmptyProfiles()
        // loadPersistedProfileIntoActiveProfile($activeProfileId)

        const platform = await Platform.getOS()
        setPlatform(platform)
    })

    $keyboardHeight = window.innerHeight / 2
    // Press ctrl + k to toggle the fake keyboard
    document.onkeydown = function (e): void {
        if (e.ctrlKey && e.key === 'c') {
            $appSettings.theme = $appSettings.theme === AppTheme.Light ? AppTheme.Dark : AppTheme.Light
            $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
        }
        if (e.ctrlKey && e.key === 'd') {
            $onboardingProfile.isDeveloperProfile = true
        }
        if (e.ctrlKey && e.key === 'k') {
            $isKeyboardOpen = !$isKeyboardOpen
        }
    }
</script>

<!-- empty div to avoid auto-purge removing dark classes -->
<div class="scheme-dark" />
<Route route={AppRoute.Login}>
    <LoginRouter />
</Route>
<Route route={AppRoute.Onboarding}>
    <OnboardingRouter />
</Route>
<Route route={AppRoute.Dashboard}>
    <DashboardView />
</Route>

<ToastContainer />
{#if $isKeyboardOpen}
    <div class="keyboard" />
{/if}

<style global type="text/scss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    @import '../shared/style/style.scss';
    html,
    body {
        @apply bg-white;
        @apply select-none;
        -webkit-user-drag: none;

        /* ===== Scrollbar CSS ===== */
        /* Chrome, Edge, and Safari */
        *::-webkit-scrollbar {
            @apply w-2;
            @apply h-2;
        }

        *::-webkit-scrollbar-button {
            display: none;
        }
        *::-webkit-scrollbar-track {
            @apply bg-transparent;
        }

        *::-webkit-scrollbar-corner {
            @apply bg-transparent;
        }

        *::-webkit-scrollbar-thumb {
            @apply bg-gray-300;
            @apply rounded-2xl;
            @apply border-none;
            @apply invisible;
        }

        *:hover::-webkit-scrollbar-thumb {
            @apply visible;
        }

        .overlay-scrollbar {
            overflow: scroll;
            overflow-x: overlay;
            overflow-y: overlay;
        }

        &.scheme-dark {
            @apply bg-gray-900;
            :global(::-webkit-scrollbar-thumb) {
                @apply border-gray-900;
            }
        }

        .multiwrap-line2 {
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
        }
    }
    @layer utilities {
        .scrollable-y {
            @apply overflow-y-auto;
            @apply -mr-2;
            @apply pr-2;
        }
    }
    img {
        -webkit-user-drag: none;
    }

    .keyboard {
        position: absolute;
        bottom: 0;
        height: 50%;
        width: 100%;
        background-color: black;
        z-index: 100;
    }
</style>
