<script lang="typescript">
    import { nativeSplash } from 'capacitor/capacitorApi'
    import { QRScanner, Route, ToastContainer, Popup } from 'shared/components'
    import { popupState } from 'shared/lib/popup'
    import { mobile, stage } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { goto } from 'shared/lib/helpers'
    import { dir, isLocaleLoaded, setupI18n, _ } from 'shared/lib/i18n'
    import { fetchMarketData } from 'shared/lib/market'
    import { pollNetworkStatus } from 'shared/lib/networkStatus'
    import { initRouter, routerNext, routerPrevious } from 'shared/lib/router'
    import { Platforms } from 'shared/lib/typings/platform'
    import { AppRoute } from 'shared/lib/typings/routes'
    import {
        Appearance,
        Backup,
        Balance,
        Congratulations,
        CrashReporting,
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
        Settings,
        Welcome,
    } from 'shared/routes'
    import { onMount } from 'svelte'
    import { Stage } from 'shared/lib/typings/stage'

    mobile.set(process.env.PLATFORM == Platforms.MOBILE)
    stage.set(Stage[process.env.STAGE.toUpperCase()] ?? Stage.ALPHA)

    $: $appSettings.darkMode
        ? document.body.classList.add('scheme-dark')
        : document.body.classList.remove('scheme-dark')

    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    $: $isLocaleLoaded, nativeSplash.hide()

    void setupI18n()
    onMount(async () => {
        initRouter()

        await fetchMarketData()
        await pollNetworkStatus()
    })
</script>

<!-- empty div to avoid auto-purge removing dark classes -->
<div class="scheme-dark" />
<div class="scanner-hide">
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
    <!-- TODO: remove locale={$_} everywhere -->
    <Route route={AppRoute.Welcome}>
        <Welcome on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Legal}>
        <Legal on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.CrashReporting}>
        <CrashReporting on:next={routerNext} on:previous={routerPrevious} locale={$_} />
    </Route>
    <Route route={AppRoute.Settings}>
        <Settings on:next={routerNext} on:previous={routerPrevious} locale={$_} />
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
</div>
<div class="scanner-ui">
    <QRScanner />
</div>

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
    // QR Scanner
    .scanner-ui {
        @apply hidden;
    }
    .scanner-hide {
        @apply visible;
    }
    body {
        &.qr-scanner {
            @apply bg-transparent;
            .scanner-ui {
                @apply block;
            }
            .scanner-hide {
                @apply hidden;
            }
        }
    }
</style>
