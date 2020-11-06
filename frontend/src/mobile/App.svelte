<script lang="typescript">
    import { onMount } from 'svelte'
    import { setupI18n, isLocaleLoaded, dir, _ } from '@shared-lib/i18n'
    import { darkMode, mobile, logged } from '@shared-lib/app'
    import { goto } from '@shared-lib/helpers'
    import { initRouter, routerNext, requestMnemonic, AppRoute } from '@shared-lib/router'
    import { Route, Toggle } from '@shared-components'
    import {
        Splash,
        Welcome,
        Legal,
        Setup,
        Password,
        Protect,
        Backup,
        Import,
        Balance,
        Migrate,
        Congratulations,
        Dashboard,
    } from '@shared-routes'

    $: $darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')

    $: if (document.dir !== $dir) {
        document.dir = $dir
    }

    let splash = true

    setupI18n()
    onMount(() => {
        setTimeout(() => {
            splash = false
            initRouter()
        }, 2000)
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
        button {
            background: var(--button-bg-color);
            padding: 0 7px;
            border-radius: 10px;
            color: var(--button-text-color);
        }
    }
</style>

{#if !$isLocaleLoaded || splash}
    <Splash />
{:else}
    <!-- dummy toggles -->
    <div class="dummy-toggles flex flex-row">
        <div class="mr-4">
            <Toggle on={darkMode} />
        </div>
        <button on:click={() => logged.update(() => false)}> reset </button>
    </div>
    <!--  -->
    <Route route={AppRoute.Welcome}>
        <Welcome on:next={routerNext} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Legal}>
        <Legal on:next={routerNext} mobile={$mobile} locale={$_} />
    </Route>
    <Route route={AppRoute.Setup}>
        <Setup on:next={routerNext} mobile={$mobile} locale={$_} />
    </Route>
    <Route route="password">
        <Password on:next={routerNext} mobile={$mobile} locale={$_} />
    </Route>
    <Route route="protect">
        <Protect on:next={routerNext} mobile={$mobile} locale={$_} />
    </Route>
    <Route route="backup">
        <Backup on:next={routerNext} on:requestMnemonic={requestMnemonic} mobile={$mobile} locale={$_} />
    </Route>
    <Route route="import">
        <Import on:next={routerNext} mobile={$mobile} locale={$_} />
    </Route>
    <Route route="balance">
        <Balance on:next={routerNext} mobile={$mobile} locale={$_} />
    </Route>
    <Route route="migrate">
        <Migrate on:next={routerNext} mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="congratulations">
        <Congratulations on:next={routerNext} mobile={$mobile} locale={$_} {goto} />
    </Route>
    <Route route="dashboard">
        <Dashboard mobile={$mobile} locale={$_} {goto} />
    </Route>
{/if}
