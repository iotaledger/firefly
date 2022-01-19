<script lang="typescript">
    import { Route, Toggle } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { goto } from 'shared/lib/helpers'
    import { dir, isLocaleLoaded, setupI18n, _ } from 'shared/lib/i18n'
    import { fetchMarketData } from 'shared/lib/market'
    import { pollNetworkStatus } from 'shared/lib/networkStatus'
    import { initRouter, routerNext, routerPrevious } from 'shared/lib/router'
    import { AppRoute } from 'shared/lib/typings/routes'
    import {
        Backup,
        Balance,
        Congratulations,
        Dashboard,
        Import,
        Legal,
        Migrate,
        Password,
        Protect,
        Settings,
        Setup,
        Splash,
        Welcome,
    } from 'shared/routes'
    import { onMount } from 'svelte'

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

<!-- empty div to avoid auto-purge removing dark classes -->
<div class="scheme-dark" />
{#if !$isLocaleLoaded || splash}
    <Splash />
{:else}
    <!-- dummy toggles -->
    <div class="dummy-toggles flex flex-row">
        <div class="mr-4">
            <Toggle on={$appSettings.darkMode} />
        </div>
        <button on:click={() => loggedIn.update(() => false)}>reset</button>
    </div>
    <!--  -->
    <Route route={AppRoute.Welcome}>
        <Welcome on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Legal}>
        <Legal on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Settings}>
        <Settings on:next={routerNext} on:previous={routerPrevious} mobile={$mobile} locale={$_} />
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
            @apply bg-blue-900;
        }
    }
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
        button {
            background: var(--button-bg-color);
            padding: 0 7px;
            border-radius: 10px;
            color: var(--button-text-color);
        }
    }
</style>
