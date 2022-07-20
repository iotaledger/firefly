<script lang="typescript">
    import { nativeSplash } from 'capacitor/capacitorApi'
    import { App } from '@capacitor/app'
    import { onMount, tick } from 'svelte'
    import { QRScanner, Route, ToastContainer, Popup } from 'shared/components'
    import { openPopup, popupState } from '@lib/popup'
    import {} from '@lib/popup'
    import { mobile, stage } from '@lib/app'
    import { appSettings } from '@lib/appSettings'
    import { goto } from '@lib/helpers'
    import { localeDirection, isLocaleLoaded, setupI18n, _ } from '@core/i18n'
    import { pollMarketData } from '@lib/market'
    import { pollNetworkStatus } from '@lib/networkStatus'
    import { AppRoute, initRouters } from '@core/router'
    import { Platforms } from '@lib/typings/platform'
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
        Welcome,
    } from 'shared/routes'
    import { Stage } from 'shared/lib/typings/stage'

    mobile.set(process.env.PLATFORM == Platforms.MOBILE)
    stage.set(Stage[process.env.STAGE?.toUpperCase()] ?? Stage.ALPHA)

    let showSplash = true

    $: $appSettings.darkMode
        ? document.body.classList.add('scheme-dark')
        : document.body.classList.remove('scheme-dark')

    $: if (document.dir !== $localeDirection) {
        document.dir = $localeDirection
    }

    $: if ($isLocaleLoaded) {
        void hideSplashScreen()
    }

    let isDoubleBack = false
    void App.addListener('backButton', () => {
        if (isDoubleBack) {
            isDoubleBack = false
            return handleContinueClick()
        }
        isDoubleBack = true
        openPopup({
            type: 'confirmCloseApp',
            hideClose: true,
            props: {
                handleContinueClick,
                handleCancelClick: () => (isDoubleBack = false),
            },
        })
    })

    function handleContinueClick() {
        // void App.exitApp()
    }

    async function hideSplashScreen() {
        await tick()
        nativeSplash.hide()
    }

    void setupI18n({ fallbackLocale: 'en', initialLocale: $appSettings.language })

    onMount(async () => {
        // Display splash screen at least for 3 seconds
        setTimeout(() => {
            showSplash = false
        }, 3000)

        initRouters()
        await pollMarketData()
        await pollNetworkStatus()
    })
</script>

{#if $isLocaleLoaded && !showSplash}
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
                overflow={$popupState.overflow}
                locale={$_}
            />
        {/if}
        <Route route={AppRoute.Welcome}>
            <Welcome locale={$_} />
        </Route>
        <Route route={AppRoute.Legal}>
            <Legal locale={$_} />
        </Route>
        <Route route={AppRoute.CrashReporting}>
            <CrashReporting locale={$_} />
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
        <QRScanner locale={$_} />
    </div>
{/if}

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

    button,
    a,
    img,
    input,
    select,
    textarea {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    a,
    button,
    img,
    [inert],
    .inert {
        user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
        -webkit-touch-callout: none;
    }

    button:active,
    button:focus {
        outline: 0px solid transparent;
    }
</style>
