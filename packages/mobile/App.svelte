<script lang="typescript">
    import { nativeSplash } from 'capacitor/capacitorApi'
    import { onMount } from 'svelte'
    import { QRScanner, Route, ToastContainer, Popup } from 'shared/components'
    import { popupState } from 'shared/lib/popup'
    import { mobile, stage } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { goto } from 'shared/lib/helpers'
    import { dir, isLocaleLoaded, setupI18n, _ } from 'shared/lib/i18n'
    import { fetchMarketData } from 'shared/lib/market'
    import { pollNetworkStatus } from 'shared/lib/networkStatus'
    import { AppRoute, initRouters } from '@core/router'
    import { Platforms } from 'shared/lib/typings/platform'
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
        initRouters()
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
        <Welcome locale={$_} />
    </Route>
    <Route route={AppRoute.Legal}>
        <Legal locale={$_} />
    </Route>
    <Route route={AppRoute.CrashReporting}>
        <CrashReporting locale={$_} />
    </Route>
    <Route route={AppRoute.Settings}>
        <Settings locale={$_} />
    </Route>
    <Route route={AppRoute.Appearance}>
        <Appearance locale={$_} />
    </Route>
    <Route route={AppRoute.Profile}>
        <Profile locale={$_} />
    </Route>
    <Route route={AppRoute.Setup}>
        <Setup locale={$_} />
    </Route>
    <Route route={AppRoute.Create}>
        <Create locale={$_} />
    </Route>
    <Route route={AppRoute.Secure}>
        <Secure locale={$_} />
    </Route>
    <Route route={AppRoute.Password}>
        <Password locale={$_} />
    </Route>
    <Route route={AppRoute.Protect} transition={false}>
        <Protect locale={$_} />
    </Route>
    <Route route={AppRoute.Backup} transition={false}>
        <Backup locale={$_} />
    </Route>
    <Route route={AppRoute.Import} transition={false}>
        <Import locale={$_} />
    </Route>
    <Route route={AppRoute.Balance}>
        <Balance locale={$_} />
    </Route>
    <Route route={AppRoute.Migrate}>
        <Migrate locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Congratulations}>
        <Congratulations locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Dashboard}>
        <Dashboard locale={$_} {goto} />
    </Route>
    <Route route={AppRoute.Login}>
        <Login locale={$_} {goto} />
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
