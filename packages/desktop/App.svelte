<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { _, isLocaleLoaded, Locale, localeDirection, setupI18n } from '@core/i18n'
    import { activeProfile, cleanupEmptyProfiles, isActiveProfileOutdated, migrateActiveProfile } from '@core/profile'
    import {
        AppRoute,
        appRoute,
        DashboardRoute,
        dashboardRouter,
        initialiseRouters,
        OnboardingRoute,
        onboardingRoute,
        openSettings,
    } from '@core/router'
    import { appSettings, appStage, AppStage, appVersionDetails, initAppSettings, setPlatform } from '@core/app'
    import { showAppNotification } from '@auxiliary/notification'
    import { closePopup, openPopup, popupState } from '@auxiliary/popup'
    import { getLocalisedMenuItems } from './lib/helpers'
    import { Electron } from './electron/lib/electron'
    import { initialiseOnboardingFlow } from '@contexts/onboarding'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { Popup, Route, TitleBar, ToastContainer, Transition } from '@ui'
    import { Dashboard, LoginRouter, OnboardingRouter, Settings, Splash } from '@views'

    appStage.set(AppStage[process.env.STAGE.toUpperCase()] ?? AppStage.ALPHA)

    const { loggedIn } = $activeProfile

    $: if ($loggedIn) {
        if (isActiveProfileOutdated($activeProfile?.version)) {
            migrateActiveProfile()
        }
    }

    async function handleCrashReporting(sendCrashReports: boolean): Promise<void> {
        await Electron.updateAppSettings({ sendCrashReports })
    }

    $: void handleCrashReporting($appSettings.sendCrashReports)
    $: $appSettings.darkMode
        ? document.body.classList.add('scheme-dark')
        : document.body.classList.remove('scheme-dark')

    $: {
        if ($isLocaleLoaded) {
            Electron.updateMenu('strings', getLocalisedMenuItems($_ as Locale))
        }
    }

    $: Electron.updateMenu(
        'canCreateNewProfile',
        $appRoute === AppRoute.Login ||
            ($appRoute === AppRoute.Onboarding &&
                $onboardingRoute !== OnboardingRoute.AppSetup &&
                $onboardingRoute !== OnboardingRoute.ShimmerClaiming &&
                $onboardingRoute !== OnboardingRoute.Congratulations)
    )

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
                closePopup()
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
            void initialiseOnboardingFlow({
                isDeveloperProfile: true,
                networkProtocol: NetworkProtocol.Shimmer,
            })
        })
        Electron.onEvent('menu-create-normal-profile', () => {
            void initialiseOnboardingFlow({
                isDeveloperProfile: false,
                networkProtocol: NetworkProtocol.Shimmer,
                networkType: NetworkType.Mainnet,
            })
        })

        Electron.onEvent('deep-link-request', showDeepLinkNotification)

        await cleanupEmptyProfiles()
        // loadPersistedProfileIntoActiveProfile($activeProfileId)

        const platform = await Electron.getOS()
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
</script>

<TitleBar>
    <!-- empty div to avoid auto-purge removing dark classes -->
    <div class="scheme-dark" />
    {#if !$isLocaleLoaded || splash}
        <Splash />
    {:else}
        {#if $popupState.active}
            <Popup
                type={$popupState.type}
                props={$popupState.props}
                hideClose={$popupState.hideClose}
                fullScreen={$popupState.fullScreen}
                transition={$popupState.transition}
                overflow={$popupState.overflow}
                relative={$popupState.relative}
            />
        {/if}
        <Route route={AppRoute.Dashboard}>
            <Transition>
                <Dashboard />
            </Transition>
        </Route>
        <Route route={AppRoute.Login}>
            <LoginRouter />
        </Route>
        <Route route={AppRoute.Onboarding}>
            <OnboardingRouter />
        </Route>
        {#if settings}
            <Settings handleClose={() => (settings = false)} />
        {/if}

        <ToastContainer />
    {/if}
</TitleBar>

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
</style>
