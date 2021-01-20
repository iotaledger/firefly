<script lang="typescript">
    import { onMount } from 'svelte'
    import { fetchMarketData } from 'shared/lib/marketData'
    import { setupI18n, isLocaleLoaded, dir, _ } from 'shared/lib/i18n'
    import { darkMode, mobile, logged } from 'shared/lib/app'
    import { api } from 'shared/lib/wallet'
    import { goto } from 'shared/lib/helpers'
    import { initRouter, routerNext, routerPrevious, AppRoute } from 'shared/lib/router'
    import { requestMnemonic } from 'shared/lib/wallet'
    import { Route, Toggle } from 'shared/components'
    import {
        Splash,
        Welcome,
        Legal,
        Setup,
        Language,
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
    $: $darkMode ? document.body.classList.add('scheme-dark') : document.body.classList.remove('scheme-dark')
    $: if (document.dir !== $dir) {
        document.dir = $dir
    }
    let splash = true
    setupI18n()
    onMount(async () => {
        setTimeout(() => {
            splash = false
            initRouter()
        }, 100)

        await fetchMarketData()
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
