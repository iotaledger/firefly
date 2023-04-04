<script lang="ts">
    import { onMount } from 'svelte'

    import { StatusBar, Style } from '@capacitor/status-bar'
    import { SplashScreen } from '@capacitor/splash-screen'

    import { DrawerManager } from '@components'
    import { ToastContainer } from '@ui'

    import { isKeyboardOpen, keyboardHeight } from '@/auxiliary/keyboard'
    import {
        appRoute,
        AppRoute,
        getAppRouter,
        getRouterForAppContext,
        goToAppContext,
        initialiseRouters,
        resetRouterForAppContext,
        resetRouters,
    } from '@/routers'

    import { onboardingProfile } from '@contexts/onboarding'

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
    import { localeDirection, setupI18n, _ } from '@core/i18n'
    import { checkAndMigrateProfiles, cleanupEmptyProfiles, activeProfile } from '@core/profile'
    import { initialiseRouterManager, RouterManagerExtensionName } from '@core/router'

    import { DashboardView, LoginRouter, OnboardingRouter } from '@views'
    import { closeAllDrawers, drawers } from '@/auxiliary/drawer'

    appStage.set(AppStage[process.env.STAGE.toUpperCase()] ?? AppStage.ALPHA)

    checkAndMigrateProfiles()

    /**
     * Handle Android top status bar (not needed for iOS)
     * @todo remove when implement status bar overlay
     * https://github.com/iotaledger/firefly/issues/6345
     */
    $: if ($drawers[0]?.id !== 'profile') {
        if ($appSettings.darkMode) {
            void StatusBar.setBackgroundColor({ color: '#1B2D4B' })
        } else if ($appRoute === AppRoute.Dashboard) {
            void StatusBar.setBackgroundColor({ color: '#F6F9FF' })
            void StatusBar.setStyle({ style: Style.Light })
        } else {
            void StatusBar.setBackgroundColor({ color: '#FFFFFF' })
            void StatusBar.setStyle({ style: Style.Light })
        }
    } else {
        if ($appSettings.darkMode) {
            void StatusBar.setBackgroundColor({ color: '#25395f' })
        } else {
            void StatusBar.setBackgroundColor({ color: '#FFFFFF' })
            void StatusBar.setStyle({ style: Style.Light })
        }
    }

    $: $appSettings.darkMode
        ? document.body.classList.add('scheme-dark')
        : document.body.classList.remove('scheme-dark')

    $: if (document.dir !== $localeDirection) {
        document.dir = $localeDirection
    }

    const loggedIn = $activeProfile?.loggedIn
    $: if ($activeProfile && !$loggedIn) {
        closeAllDrawers()
    }

    void setupI18n({ fallbackLocale: 'en', initialLocale: $appSettings.language })

    onMount(async () => {
        setTimeout(() => {
            SplashScreen.hide()
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

        initialiseRouterManager({
            extensions: [
                [RouterManagerExtensionName.GetAppRouter, getAppRouter],
                [RouterManagerExtensionName.GetRouterForAppContext, getRouterForAppContext],
                [RouterManagerExtensionName.GoToAppContext, goToAppContext],
                [RouterManagerExtensionName.ResetRouterForAppContext, resetRouterForAppContext],
                [RouterManagerExtensionName.ResetRouters, resetRouters],
            ],
        })

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
{#if $appRoute === AppRoute.Login}
    <LoginRouter />
{:else if $appRoute === AppRoute.Onboarding}
    <OnboardingRouter />
{:else if $appRoute === AppRoute.Dashboard}
    {#key $_}
        <DashboardView />
    {/key}
{/if}
<DrawerManager />
<ToastContainer swipe fadeDuration={100} classes="fixed top-0 p-5 z-10 w-full" showDismiss />

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
        -webkit-user-drag: none;
        user-select: none;
        -webkit-user-select: none;

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
