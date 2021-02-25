<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { fetchMarketData } from 'shared/lib/marketData'
    import { pollNetworkStatus } from 'shared/lib/networkStatus'
    import { setupI18n, isLocaleLoaded, dir, _, activeLocale } from 'shared/lib/i18n'
    import { darkMode, mobile, loggedIn } from 'shared/lib/app'
    import { activeProfile } from 'shared/lib/profile'
    import { goto } from 'shared/lib/helpers'
    import { initRouter, routerNext, routerPrevious, route as appRoute, dashboardRoute, walletRoute, settingsRoute } from 'shared/lib/router'
    import { AppRoute, Tabs } from 'shared/lib/typings/routes'
    import { popupState } from 'shared/lib/popup'
    import { requestMnemonic } from 'shared/lib/wallet'
    import { Route, Toggle, Popup } from 'shared/components'
    import { refreshVersionDetails } from 'shared/lib/appUpdater'
    import {
        Splash,
        Welcome,
        Legal,
        Setup,
        Create,
        Language,
        Ledger,
        Password,
        Protect,
        Backup,
        Import,
        Balance,
        Migrate,
        Congratulations,
        Dashboard,
        Login,
    } from 'shared/routes'
    import { getLocalisedMenuItems } from './lib/helpers'

    const locale = activeLocale

    $: $darkMode ? document.body.classList.add('scheme-dark') : document.body.classList.remove('scheme-dark')
    $: if (activeLocale !== locale) {
        window['Electron'].updateMenu('strings', getLocalisedMenuItems($_))
    }
    $: window['Electron'].updateMenu('loggedIn', $loggedIn)

    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    let splash = true
    setupI18n({ withLocale: get(activeProfile) ? get(activeProfile).settings.language : 'en' })
    onMount(async () => {
        setTimeout(() => {
            splash = false
            initRouter()
        }, 100)

        await fetchMarketData()
        await pollNetworkStatus()

        // @ts-ignore: This value is replaced by Webpack DefinePlugin
        if (!devMode) {
            await refreshVersionDetails()
        }
        window['Electron'].onEvent('menu-navigate-wallet', (route) => {
            if (get(dashboardRoute) !== Tabs.Wallet) {
                dashboardRoute.set(Tabs.Wallet)
            }
            walletRoute.set(route)
        })
        window['Electron'].onEvent('menu-navigate-settings', (route) => {
            if (get(appRoute) !== AppRoute.Dashboard) {
                  // TODO: Add settings from login
            } else if (get(dashboardRoute) !== Tabs.Settings) {
                dashboardRoute.set(Tabs.Settings)
            }
            settingsRoute.set(route)
        })

    })
</script>

<style global type="text/scss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    @import '../shared/style/style.scss';
    // dummy toggles
    .dummy-toggles {
        position: absolute;
        right: 5px;
        top: 5px;
        z-index: 10;
        font-size: 12px;
        display: flex;
        padding: 5px;
        background: #8080803d;
        border-radius: 10px;
    }
    html,
    body {
        @apply bg-white;
        &.scheme-dark {
            @apply bg-blue-900;
        }
    }
</style>

<!-- empty div to avoid auto-purge removing dark classes -->
<div class="scheme-dark" />
{#if !$isLocaleLoaded || splash}
<Splash />
{:else}
    {#if $popupState.active}
        <Popup type={$popupState.type} props={$popupState.props} locale={$_} />
    {/if}
    <!-- dummy toggles -->
    <div class="dummy-toggles flex flex-row">
        <Toggle storeItem={darkMode} />
    </div>
    <!--  -->
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
    <Route route={AppRoute.Create}>
        <Create on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.LedgerSetup}>
        <Ledger on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
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
        <Migrate on:next={routerNext} mobile={$mobile} locale={$_} {goto} />
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
{/if}
