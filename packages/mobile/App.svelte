<script lang="ts">
    import { onMount } from 'svelte'

    import { StatusBar, Style } from '@capacitor/status-bar'
    import { SplashScreen } from '@capacitor/splash-screen'
    import { Keyboard } from '@capacitor/keyboard'

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

    import {
        appSettings,
        appStage,
        AppStage,
        hasCompletedAppSetup,
        initAppSettings,
        Platform,
        setAppVersionDetails,
        setPlatform,
    } from '@core/app'
    import { localeDirection, setupI18n, _ } from '@core/i18n'
    import { checkAndMigrateProfiles, cleanupEmptyProfiles, activeProfile } from '@core/profile'
    import { initialiseRouterManager, RouterManagerExtensionName } from '@core/router'

    import { DashboardView, LoginRouter, OnboardingRouter } from '@views'
    import { closeAllDrawers, DrawerId, drawers } from '@/auxiliary/drawer'

    appStage.set(AppStage[process.env.STAGE.toUpperCase()] ?? AppStage.ALPHA)

    checkAndMigrateProfiles()

    const htmlElement = document.getElementsByTagName('html')[0]

    /**
     * Handle Android top status bar (not needed for iOS)
     * @todo remove when implement status bar overlay
     * https://github.com/iotaledger/firefly/issues/6345
     */
    $: if ($appSettings.darkMode) {
        if ($drawers[0]?.id === DrawerId.Profile) {
            void StatusBar.setBackgroundColor({ color: '#25395f' })
            void StatusBar.setStyle({ style: Style.Dark })
            htmlElement.style.backgroundColor = '#25395f'
        } else {
            void StatusBar.setBackgroundColor({ color: '#1B2D4B' })
            void StatusBar.setStyle({ style: Style.Dark })
            htmlElement.style.backgroundColor = '#1B2D4B'
        }
    } else {
        void StatusBar.setBackgroundColor({ color: '#FFFFFF' })
        void StatusBar.setStyle({ style: Style.Light })
        void StatusBar.setBackgroundColor({ color: '#FFFFFF' })
        htmlElement.style.backgroundColor = '#FFFFFF'
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

    $keyboardHeight = window.screen.height / 3.5 // set initial state

    void Keyboard.addListener('keyboardWillShow', (info) => {
        $keyboardHeight = info.keyboardHeight
        $isKeyboardOpen = true
    })
    void Keyboard.addListener('keyboardWillHide', () => {
        $isKeyboardOpen = false
    })

    onMount(async () => {
        setTimeout(() => {
            SplashScreen.hide()
            initialiseRouters()
        }, 3000)

        let initialLocale = $hasCompletedAppSetup ? $appSettings.language : await Platform.getLanguageCode()
        // patch for 'es' & 'pt' cases where we can't get the region code
        initialLocale = initialLocale === 'es' ? 'es-ES' : initialLocale === 'pt' ? 'pt-PT' : initialLocale
        void setupI18n({ fallbackLocale: 'en', initialLocale })

        initAppSettings.set($appSettings)

        initialiseRouterManager({
            extensions: [
                [RouterManagerExtensionName.GetAppRouter, getAppRouter],
                [RouterManagerExtensionName.GetRouterForAppContext, getRouterForAppContext],
                [RouterManagerExtensionName.GoToAppContext, goToAppContext],
                [RouterManagerExtensionName.ResetRouterForAppContext, resetRouterForAppContext],
                [RouterManagerExtensionName.ResetRouters, resetRouters],
            ],
        })

        if (process.env.NODE_ENV !== 'development') {
            await setAppVersionDetails()
        }

        await cleanupEmptyProfiles()

        const platform = await Platform.getOS()
        setPlatform(platform)
    })
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

<style global lang="scss">
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

        /** CSS safe-area margins */
        padding-top: calc(env(safe-area-inset-top) / 3);
        padding-bottom: env(safe-area-inset-bottom);

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
</style>
