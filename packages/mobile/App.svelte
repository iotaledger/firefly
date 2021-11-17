<script lang="typescript">
    import { Popup, Route, Toggle, ToastContainer } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { goto } from 'shared/lib/helpers'
    import { dir, isLocaleLoaded, setupI18n, _ } from 'shared/lib/i18n'
    import { fetchMarketData } from 'shared/lib/market'
    import { pollNetworkStatus } from 'shared/lib/networkStatus'
    import { initRouter, routerNext, routerPrevious, setRoute } from 'shared/lib/router'
    import { AppRoute } from 'shared/lib/typings/routes'
    import {
        Appearance,
        Backup,
        Balance,
        Congratulations,
        Create,
        Dashboard,
        Import,
        Legal,
        Login,
        Migrate,
        Password,
        Profile,
        Protect,
        Secure,
        Setup,
        Splash,
        Welcome,
    } from 'shared/routes'
    import { popupState } from 'shared/lib/popup'
    import { onMount } from 'svelte'

    mobile.set(true)

    $: $appSettings.darkMode ? document.body.classList.add('scheme-dark') : document.body.classList.remove('scheme-dark')

    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    let splash = true

    void setupI18n()
    onMount(async () => {
        setTimeout(() => {
            splash = false
            initRouter()
        }, 2000)

        await fetchMarketData()
        await pollNetworkStatus()
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
            @apply bg-gray-900;
        }
    }

    .setup-anim-aspect-ratio {
        aspect-ratio: 19/15;
    }
</style>

<!-- empty div to avoid auto-purge removing dark classes -->
<div class="scheme-dark" />
{#if !$isLocaleLoaded || splash}
    <Splash />
{:else}
    <!-- TODO: remove locale={$_} everywhere -->
    <Route route={AppRoute.Welcome}>
        <Welcome on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Legal}>
        <Legal on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Appearance}>
        <Appearance on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Profile}>
        <Profile on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Setup}>
        <Setup on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Create}>
        <Create on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Secure}>
        <Secure on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Password}>
        <Password on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Protect} transition={false}>
        <Protect on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Backup} transition={false}>
        <Backup on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Import} transition={false}>
        <Import on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Balance}>
        <Balance on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Migrate}>
        <Migrate on:next={routerNext} on:previous={routerPrevious} locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Congratulations}>
        <Congratulations on:next={routerNext} locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Dashboard}>
        <Dashboard locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Login}>
        <Login on:next={routerNext} on:previous={routerPrevious} locale={$_} {goto} />
    </Route>

    <ToastContainer />

    {#if $popupState.active}
        <Popup
            type={$popupState.type}
            props={$popupState.props}
            hideClose={$popupState.hideClose}
            fullScreen={$popupState.fullScreen}
            transition={$popupState.transition}
            locale={$_}
        />
    {/if}
{/if}
