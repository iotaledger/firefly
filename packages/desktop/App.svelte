<script lang="typescript">
    import { isLocaleLoaded, Locale, localeDirection, setupI18n, _ } from '@core/i18n'
    import { activeProfile, cleanupEmptyProfiles, isActiveProfileOutdated, migrateActiveProfile } from '@core/profile'
    import {
        accountRouter,
        AppRoute,
        appRouter,
        DashboardRoute,
        dashboardRouter,
        initRouters,
        openSettings,
    } from '@core/router'
    import { Popup, Route, TitleBar, ToastContainer } from 'shared/components'
    import {
        appSettings,
        appStage,
        AppStage,
        appVersionDetails,
        initAppSettings,
        pollCheckForAppUpdate,
        setAppVersionDetails,
    } from '@core/app'
    import { Electron } from 'shared/lib/electron'
    import { addError } from '@core/error'
    import { goto } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { Dashboard, LoginRouter, OnboardingRouter, Settings, Splash } from 'shared/routes'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { getLocalisedMenuItems } from './lib/helpers'
    import { initialiseOnboardingProfile } from '@contexts/onboarding'

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

    $: {
        if ($isLocaleLoaded) {
            Electron.updateMenu('strings', getLocalisedMenuItems($_ as Locale))
        }
    }
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
            initRouters()
        }, 3000)

        initAppSettings.set($appSettings)

        // await pollMarketData()

        // @ts-ignore: This value is replaced by Webpack DefinePlugin
        /* eslint-disable no-undef */
        if (!devMode && get(appStage) === AppStage.PROD) {
            await setAppVersionDetails()
            pollCheckForAppUpdate()
        }
        Electron.onEvent('menu-navigate-wallet', (route) => {
            $dashboardRouter.goTo(DashboardRoute.Wallet)
            $accountRouter.goTo(route)
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
            get(appRouter).next({ shouldAddProfile: true })
            initialiseOnboardingProfile({ isDeveloperProfile: true })
        })
        Electron.onEvent('menu-create-normal-profile', () => {
            get(appRouter).reset()
            get(appRouter).next({ shouldAddProfile: true })
            initialiseOnboardingProfile({ isDeveloperProfile: false })
        })
        Electron.hookErrorLogger((err) => {
            addError(err)
        })

        Electron.onEvent('deep-link-request', showDeepLinkNotification)

        await cleanupEmptyProfiles()
        // loadPersistedProfileIntoActiveProfile($activeProfileId)
    })

    onDestroy(() => {
        Electron.removeListenersForEvent('deep-link-request')
        Electron.DeepLinkManager.clearDeepLinkRequest()
    })

    const showDeepLinkNotification = () => {
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
                locale={$_}
            />
        {/if}
        <Route route={AppRoute.Dashboard}>
            <Dashboard locale={$_} {goto} />
        </Route>
        <Route route={AppRoute.Login}>
            <LoginRouter {goto} />
        </Route>
        <Route route={AppRoute.Onboarding}>
            <OnboardingRouter {goto} />
        </Route>
        {#if settings}
            <Settings locale={$_} handleClose={() => (settings = false)} />
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

        ::-webkit-scrollbar {
            @apply w-5;
            @apply h-5;
        }

        ::-webkit-scrollbar-track {
            @apply bg-transparent;
        }

        ::-webkit-scrollbar-corner {
            @apply bg-transparent;
        }

        ::-webkit-scrollbar-thumb {
            @apply bg-gray-300;
            @apply border-solid;
            @apply rounded-2xl;
            border-width: 7px;
            /* This needs to match the background it is displayed on
               and can be override in local components using the secondary
               and tertiary styles */
            @apply border-white;
        }

        .scroll-secondary {
            &::-webkit-scrollbar-thumb {
                @apply border-white;
            }
        }

        .scroll-tertiary {
            &::-webkit-scrollbar-thumb {
                @apply border-gray-50;
            }
        }

        .scroll-quaternary {
            &::-webkit-scrollbar-thumb {
                @apply border-gray-100;
            }
        }

        &.scheme-dark {
            @apply bg-gray-900;
            :global(::-webkit-scrollbar-thumb) {
                @apply bg-gray-700;
                @apply border-gray-900;
            }

            .scroll-secondary {
                &::-webkit-scrollbar-thumb {
                    @apply border-gray-800;
                }
            }

            .scroll-tertiary {
                &::-webkit-scrollbar-thumb {
                    @apply border-gray-900;
                }
            }

            .scroll-quaternary {
                &::-webkit-scrollbar-thumb {
                    @apply border-gray-900;
                }
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
