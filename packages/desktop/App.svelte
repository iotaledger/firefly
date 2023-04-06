<script lang="ts">
    // Must be imported first to run
    import { Locale, _, isLocaleLoaded, localeDirection, setupI18n } from '@core/i18n'

    // Other imports
    import { showAppNotification } from '@auxiliary/notification'
    import { PopupId, closePopup, openPopup, popupState } from '@auxiliary/popup'
    import { Popup, TitleBar } from '@components'
    import { initialiseOnboardingFlow } from '@contexts/onboarding'
    import {
        AppContext,
        AppStage,
        Platform,
        PlatformOption,
        appSettings,
        appStage,
        appVersionDetails,
        initAppSettings,
        platform,
        registerAppEvents,
        setAppVersionDetails,
        setPlatform,
    } from '@core/app'
    import { NetworkId } from '@core/network'
    import { downloadNextNftInQueue, nftDownloadQueue } from '@core/nfts'
    import { activeProfile, checkAndMigrateProfiles, cleanupEmptyProfiles } from '@core/profile'
    import {
        AppRoute,
        DashboardRoute,
        OnboardingRoute,
        RouterManagerExtensionName,
        appRoute,
        dashboardRouter,
        initialiseRouterManager,
        onboardingRoute,
        onboardingRouter,
        routerManager,
    } from '@core/router'

    import { ToastContainer, Transition } from '@ui'
    import { Dashboard, LoginRouter, OnboardingRouter, Settings, Splash } from '@views'
    import { onDestroy, onMount } from 'svelte'
    import { getLocalisedMenuItems } from './lib/helpers'
    import {
        getAppRouter,
        getRouterForAppContext,
        goToAppContext,
        initialiseRouters,
        resetRouterForAppContext,
        resetRouters,
    } from './lib/routers'
    import { openSettings } from './lib/routers/actions/openSettings'

    appStage.set(AppStage[process.env.STAGE.toUpperCase()] ?? AppStage.ALPHA)

    const { loggedIn, hasLoadedAccounts } = $activeProfile

    $: if ($activeProfile && !$loggedIn) {
        closePopup(true)
    }

    async function handleCrashReporting(sendCrashReports: boolean): Promise<void> {
        await Platform.updateAppSettings({ sendCrashReports })
    }

    $: void handleCrashReporting($appSettings.sendCrashReports)

    $: $appSettings.darkMode
        ? document.body.classList.add('scheme-dark')
        : document.body.classList.remove('scheme-dark')

    $: {
        if ($isLocaleLoaded) {
            Platform.updateMenu('strings', getLocalisedMenuItems($_ as Locale))
        }
    }

    $: Platform.updateMenu(
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

    $: isDashboardVisible = $appRoute === AppRoute.Dashboard && $hasLoadedAccounts && $popupState.id !== 'busy'
    $: isWindows = $platform === PlatformOption.Windows

    $: $nftDownloadQueue, downloadNextNftInQueue()

    let splash = true
    let settings = false

    void setupI18n({ fallbackLocale: 'en', initialLocale: $appSettings.language })

    onMount(async () => {
        await cleanupEmptyProfiles()
        checkAndMigrateProfiles()

        setTimeout(() => {
            splash = false
            initialiseRouters()
        }, 3000)

        initAppSettings.set($appSettings)

        initialiseRouterManager({
            extensions: [
                [RouterManagerExtensionName.GetAppRouter, getAppRouter],
                [RouterManagerExtensionName.GetRouterForAppContext, getRouterForAppContext],
                [RouterManagerExtensionName.GoToAppContext, goToAppContext],
                // TODO: https://github.com/iotaledger/firefly/issues/5201
                [RouterManagerExtensionName.OpenSettings, openSettings],
                [RouterManagerExtensionName.ResetRouterForAppContext, resetRouterForAppContext],
                [RouterManagerExtensionName.ResetRouters, resetRouters],
            ],
        })

        // await pollMarketData()

        // Used for auto updates
        registerAppEvents()
        if (process.env.NODE_ENV !== 'development') {
            await setAppVersionDetails()
            if ($appVersionDetails.upToDate === false) {
                openPopup({ id: PopupId.CheckForUpdates })
            }
        }

        Platform.onEvent('menu-navigate-wallet', () => {
            $dashboardRouter.goTo(DashboardRoute.Wallet)
        })
        Platform.onEvent('menu-navigate-settings', () => {
            if ($loggedIn) {
                closePopup()
                $routerManager.openSettings()
            } else {
                settings = true
            }
        })
        Platform.onEvent('menu-check-for-update', () => {
            openPopup({
                id: PopupId.CheckForUpdates,
                props: {
                    currentVersion: $appVersionDetails.currentVersion,
                },
            })
        })
        Platform.onEvent('menu-error-log', () => {
            openPopup({ id: PopupId.ErrorLog })
        })
        Platform.onEvent('menu-diagnostics', () => {
            openPopup({ id: PopupId.Diagnostics })
        })
        Platform.onEvent('menu-create-developer-profile', async () => {
            await initialiseOnboardingFlow({
                isDeveloperProfile: true,
            })
            $routerManager.goToAppContext(AppContext.Onboarding)
            $onboardingRouter.goTo(OnboardingRoute.NetworkSetup)
        })
        Platform.onEvent('menu-create-normal-profile', async () => {
            await initialiseOnboardingFlow({
                isDeveloperProfile: false,
                networkId: NetworkId.Shimmer,
            })
            $routerManager.goToAppContext(AppContext.Onboarding)
            $onboardingRouter.goTo(OnboardingRoute.ProfileSetup)
        })

        Platform.onEvent('deep-link-request', showDeepLinkNotification)

        const platform = await Platform.getOS()
        setPlatform(platform)
    })

    onDestroy(() => {
        Platform.removeListenersForEvent('deep-link-request')
        Platform.DeepLinkManager.clearDeepLinkRequest()
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

<app-container class="block w-full h-full">
    <TitleBar />
    <app-body
        class="block fixed left-0 right-0 bottom-0 z-50 top-0"
        class:top-placement={isWindows || isDashboardVisible}
    >
        <div class="scheme-dark" />
        {#if !$isLocaleLoaded || splash}
            <Splash />
        {:else}
            {#if $popupState.active}
                <Popup
                    id={$popupState.id}
                    props={$popupState.props}
                    hideClose={$popupState.hideClose}
                    fullScreen={$popupState.fullScreen}
                    transition={$popupState.transition}
                    overflow={$popupState.overflow}
                    relative={$popupState.relative}
                />
            {/if}
            {#if $appRoute === AppRoute.Dashboard}
                <Transition>
                    <Dashboard />
                </Transition>
            {:else if $appRoute === AppRoute.Login}
                <LoginRouter />
            {:else if $appRoute === AppRoute.Onboarding}
                <OnboardingRouter />
            {/if}
            {#if settings}
                <Settings handleClose={() => (settings = false)} />
            {/if}
            <ToastContainer classes="absolute right-5 bottom-5 w-100" />
        {/if}
    </app-body>
</app-container>

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
    app-body.top-placement {
        @apply top-9;
    }
</style>
