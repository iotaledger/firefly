<script lang="typescript">
    import { App } from '@capacitor/app'
    import { nativeSplash } from 'capacitor/capacitorApi'
    import { Keyboard } from '@capacitor/keyboard'
    import { StatusBar, Style } from '@capacitor/status-bar'
    import { onMount, tick } from 'svelte'
    import { QRScanner, Route, ToastContainer, Popup } from 'shared/components'
    import { popupState } from '@lib/popup'
    import { logout, keyboardHeight, isKeyboardOpened, mobile, stage, isAndroid } from '@lib/app'
    import { appSettings } from '@lib/appSettings'
    import { goto } from '@lib/helpers'
    import { localeDirection, isLocaleLoaded, setupI18n, _ } from '@core/i18n'
    import { pollMarketData } from '@lib/market'
    import { pollNetworkStatus } from '@lib/networkStatus'
    import { allowBackButton, AppRoute, appRoute, BackButtonHeap, backButtonStore, initRouters } from '@core/router'
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
    import { Platform } from '@lib/platform'
    import { getVersionDetails } from '@lib/appUpdater'

    mobile.set(process.env.PLATFORM == Platforms.MOBILE)
    stage.set(Stage[process.env.STAGE?.toUpperCase()] ?? Stage.ALPHA)

    let showSplash = true

    $: if ($appSettings.darkMode) {
        document.body.classList.add('scheme-dark')

        void StatusBar.setStyle({ style: Style.Dark })
        // Android only status bar background color
        void StatusBar.setBackgroundColor({ color: '#25395f' })
    } else {
        document.body.classList.remove('scheme-dark')
        void StatusBar.setStyle({ style: Style.Light })
        void StatusBar.setBackgroundColor({ color: '#ffffff' })
    }

    /**
     * Handle Android darkmode top status bar
     * @todo remove when implement status bar overlay
     */
    $: if ($appRoute !== AppRoute.Dashboard) {
        if ($appSettings.darkMode) {
            void StatusBar.setBackgroundColor({ color: '#1B2D4B' })
        }
    } else {
        if ($appSettings.darkMode) {
            void StatusBar.setBackgroundColor({ color: '#25395f' })
        }
    }

    $: if (document.dir !== $localeDirection) {
        document.dir = $localeDirection
    }

    $: if ($isLocaleLoaded) {
        void hideSplashScreen()
    }

    backButtonStore.set(
        new BackButtonHeap(async () => {
            await logout()
            App.exitApp()
        })
    )

    // Note: added hideClose condition to popups only as it is the only way we use it
    void App.addListener('backButton', () => {
        if (!$popupState.hideClose && $allowBackButton) {
            const next = $backButtonStore.pop()
            if (next) {
                next()
            }
        }
    })

    $keyboardHeight = window.innerHeight / 2
    void Keyboard.addListener('keyboardWillShow', (info) => {
        // Listen for when the keyboard is about to be showed.
        $keyboardHeight = info.keyboardHeight
        $isKeyboardOpened = true
    })
    void Keyboard.addListener('keyboardWillHide', () => {
        // Listen for when the keyboard is about to be hidden.
        $isKeyboardOpened = false
    })

    async function hideSplashScreen() {
        await tick()
        nativeSplash.hide()
    }

    void setupI18n({ fallbackLocale: 'en', initialLocale: $appSettings.language })

    onMount(async () => {
        isAndroid.set((await Platform.getOS()) !== 'ios')
        // Display splash screen at least for 3 seconds
        setTimeout(() => {
            showSplash = false
        }, 3000)

        initRouters()
        await getVersionDetails()
        await pollMarketData()
        await pollNetworkStatus()
    })

    // TODO: Has to be enabled again when system notifications are implemented
    $appSettings.notifications = false
</script>

{#if $isLocaleLoaded && !showSplash}
    <!-- empty div to avoid auto-purge removing dark classes -->
    <div class="scheme-dark" />
    <div class="scanner-hide" style="--transition-scroll: cubic-bezier(0, 0.3, 0, 1)">
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
        aspect-ratio: auto;
    }
    // QR Scanner
    .scanner-ui {
        @apply hidden;
    }
    .scanner-hide {
        @apply visible;
        --transition-scroll: cubic-bezier(0, 0.3, 0, 1);
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
    /** Force Android inner divs scrolbars, iOS is not affected */
    ::-webkit-scrollbar {
        width: 3px;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(127, 127, 127, 0.5);
        border-radius: 10px;
        -webkit-border-radius: 10px;
    }
</style>
