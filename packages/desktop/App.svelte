<script lang="typescript">
    import { Popup, Route, ToastContainer } from 'shared/components'
    import { darkMode, loggedIn, mobile } from 'shared/lib/app'
    import { refreshVersionDetails, versionDetails } from 'shared/lib/appUpdater'
    import { Electron } from 'shared/lib/electron'
    import { goto } from 'shared/lib/helpers'
    import { activeLocale, dir, isLocaleLoaded, setupI18n, _ } from 'shared/lib/i18n'
    import { fetchMarketData } from 'shared/lib/marketData'
    import { pollNetworkStatus } from 'shared/lib/networkStatus'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile } from 'shared/lib/profile'
    import { dashboardRoute, initRouter, routerNext, routerPrevious, walletRoute } from 'shared/lib/router'
    import { AppRoute, Tabs } from 'shared/lib/typings/routes'
    import { requestMnemonic } from 'shared/lib/wallet'
    import {
        Backup,
        Balance,
        Congratulations,
        Dashboard,
        Import,
        Language,
        Legal,
        Login,
        Migrate,
        Password,
        Protect,
        Setup,
        Splash,
        Welcome,
    } from 'shared/routes'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { getLocalisedMenuItems } from './lib/helpers'

    const locale = activeLocale

    $: $darkMode ? document.body.classList.add('scheme-dark') : document.body.classList.remove('scheme-dark')
    $: if (activeLocale !== locale) {
        Electron.updateMenu('strings', getLocalisedMenuItems($_))
    }
    $: Electron.updateMenu('loggedIn', $loggedIn)

    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    let splash = true
    setupI18n({ withLocale: get(activeProfile)?.settings.language ?? 'en' })
    onMount(async () => {
        setTimeout(() => {
            splash = false
            initRouter()
        }, 2000)

        await fetchMarketData()
        await pollNetworkStatus()

        // @ts-ignore: This value is replaced by Webpack DefinePlugin
        if (!devMode) {
            await refreshVersionDetails()
        }
        Electron.onEvent('menu-navigate-wallet', (route) => {
            if (get(dashboardRoute) !== Tabs.Wallet) {
                dashboardRoute.set(Tabs.Wallet)
            }
            walletRoute.set(route)
        })
        Electron.onEvent('menu-navigate-settings', () => {
            if (get(dashboardRoute) !== Tabs.Settings) {
                dashboardRoute.set(Tabs.Settings)
            }
        })
        Electron.onEvent('menu-check-for-update', async () => {
            await refreshVersionDetails()
            openPopup({
                type: 'version',
                props: {
                    currentVersion: $versionDetails.currentVersion,
                },
            })
        })
        Electron.onEvent('menu-error-log', async () => {
            openPopup({ type: 'errorLog' })
        })
        Electron.onEvent('menu-diagnostics', async () => {
            openPopup({ type: 'diagnostics' })
        })
    })
</script>

<style global type="text/scss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    @import '../shared/style/style.scss';
    html,
    body {
        @apply bg-white;
        &.scheme-dark {
            @apply bg-blue-900;
        }

        @apply select-none;
    }
    ::-webkit-scrollbar {
        @apply w-1;
    }
    ::-webkit-scrollbar-thumb {
        @apply bg-gray-300;
        border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
        @apply bg-gray-100;
        border-radius: 10px;
    }
</style>

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
            locale={$_} />
    {/if}
    <Route route={AppRoute.Welcome}>
        <Welcome on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Legal}>
        <Legal on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Language}>
        <Language on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Setup}>
        <Setup on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Password}>
        <Password on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Protect} transition={false}>
        <Protect on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Backup} transition={false}>
        <Backup
            on:next={routerNext}
            on:previous={routerPrevious}
            on:requestMnemonic={requestMnemonic}
            mobile={$mobile}
            locale={$_} />
    </Route>
    <Route route={AppRoute.Import} transition={false}>
        <Import on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Balance}>
        <Balance on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Migrate}>
        <Migrate on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Congratulations}>
        <Congratulations on:next={routerNext} mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Dashboard}>
        <Dashboard mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Login}>
        <Login on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} {goto} />
    </Route>
    <ToastContainer />
{/if}
