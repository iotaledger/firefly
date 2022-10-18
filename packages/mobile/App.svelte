<script lang="typescript">
    import { localeDirection, setupI18n, _ } from '@core/i18n'
    import { activeProfile, cleanupEmptyProfiles, isActiveProfileOutdated, migrateActiveProfile } from '@core/profile'
    import { AppRoute, appRoute, appRouter, initialiseRouters, initialiseOnboardingRouters } from './lib/core/router'
    import { DashboardRoute, dashboardRouter, OnboardingRoute, onboardingRoute, openSettings } from '@core/router'
    import { Route } from './components'
    import { ToastContainer } from 'shared/components'
    import {
        AppTheme,
        appSettings,
        appStage,
        AppStage,
        appVersionDetails,
        initAppSettings,
        shouldBeDarkMode,
    } from '@core/app'
    import { Electron } from 'shared/lib/electron'
    import { addError } from '@core/error'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from '@auxiliary/popup'
    import { DashboardRouter, LoginRouter, OnboardingRouter } from './routes'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { onboardingProfile, initialiseOnboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { Platform } from '@lib/platform'
    import { setPlatform } from '@core/app/stores/platform.store'
    import { NetworkProtocol, NetworkType } from '@core/network'

    import { isKeyboardOpen, keyboardHeight } from './lib/auxiliary/keyboard'

    appStage.set(AppStage[process.env.STAGE.toUpperCase()] ?? AppStage.ALPHA)

    const { loggedIn } = $activeProfile

    $: if ($loggedIn) {
        if (isActiveProfileOutdated($activeProfile?.version)) {
            migrateActiveProfile()
        }
    }

    const handleCrashReporting = async (sendCrashReports: boolean): Promise<void> =>
        Electron.updateAppSettings({ sendCrashReports })

    $: void handleCrashReporting($appSettings.sendCrashReports)
    $: $appSettings.darkMode
        ? document.body.classList.add('scheme-dark')
        : document.body.classList.remove('scheme-dark')

    $: Electron.updateMenu(
        'canCreateNewProfile',
        $appRoute === AppRoute.Login ||
            ($appRoute === AppRoute.Onboarding &&
                $onboardingRoute !== OnboardingRoute.AppSetup &&
                $onboardingRoute !== OnboardingRoute.ShimmerClaiming &&
                $onboardingRoute !== OnboardingRoute.Congratulations)
    )

    $: Electron.updateMenu('loggedIn', $loggedIn)

    $: if (document.dir !== $localeDirection) {
        document.dir = $localeDirection
    }

    let splash = true
    let settings = false

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
        Electron.onEvent('menu-navigate-wallet', () => {
            $dashboardRouter.goTo(DashboardRoute.Wallet)
        })
        Electron.onEvent('menu-navigate-settings', () => {
            if ($loggedIn) {
                openSettings()
            } else {
                settings = true
            }
        })
        Electron.onEvent('menu-check-for-update', () => {
            openPopup({
                type: 'version',
                props: {
                    currentVersion: $appVersionDetails.currentVersion,
                },
            })
        })
        Electron.onEvent('menu-error-log', () => {
            openPopup({ type: 'errorLog' })
        })
        Electron.onEvent('menu-diagnostics', () => {
            openPopup({ type: 'diagnostics' })
        })
        Electron.onEvent('menu-create-developer-profile', () => {
            get(appRouter).reset()
            initialiseOnboardingProfile(true, NetworkProtocol.Shimmer)
            initialiseOnboardingRouters()
            get(appRouter).next({ shouldAddProfile: true })
        })
        Electron.onEvent('menu-create-normal-profile', () => {
            get(appRouter).reset()
            initialiseOnboardingProfile(false, NetworkProtocol.Shimmer)
            updateOnboardingProfile({ networkType: NetworkType.Mainnet })
            initialiseOnboardingRouters()
            get(appRouter).next({ shouldAddProfile: true })
        })
        Electron.hookErrorLogger((err) => {
            addError(err)
        })

        Electron.onEvent('deep-link-request', showDeepLinkNotification)

        await cleanupEmptyProfiles()
        // loadPersistedProfileIntoActiveProfile($activeProfileId)

        const platform = await Platform.getOS()
        setPlatform(platform)
    })

    onDestroy(() => {
        Electron.removeListenersForEvent('deep-link-request')
        Electron.DeepLinkManager.clearDeepLinkRequest()
    })

    function showDeepLinkNotification(): void {
        if (!$loggedIn) {
            showAppNotification({
                type: 'info',
                message: $_('notifications.deepLinkingRequest.receivedWhileLoggedOut'),
            })
        }
    }

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
    <DashboardRouter />
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
