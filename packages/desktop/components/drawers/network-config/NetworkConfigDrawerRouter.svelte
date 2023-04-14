<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Router } from '@core/router'
    import { NetworkConfigRoute, NetworkConfigRouter, networkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { ChainInformationSideDrawer, ConnectedChainsSideDrawer } from './drawers'

    export let drawerRoute: unknown
    export let drawerRouter: Router<unknown>

    $: drawerRoute = $networkConfigRoute

    onMount(() => {
        $networkConfigRouter = new NetworkConfigRouter()
        drawerRouter = $networkConfigRouter
    })

    onDestroy(() => {
        $networkConfigRouter = null
    })
</script>

{#if $networkConfigRoute === NetworkConfigRoute.ConnectedChains}
    <ConnectedChainsSideDrawer />
{:else if $networkConfigRoute === NetworkConfigRoute.ChainInformation}
    <ChainInformationSideDrawer />
{/if}
