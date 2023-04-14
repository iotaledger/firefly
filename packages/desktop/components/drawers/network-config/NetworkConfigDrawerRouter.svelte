<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Router } from '@core/router'
    import { NetworkConfigRoute, NetworkConfigRouter, networkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import {
        AddChainSideDrawer,
        ChainDepositAddressSideDrawer,
        ChainInformationSideDrawer,
        ConnectedChainsSideDrawer,
        EditChainSideDrawer,
        RemoveChainSideDrawer,
    } from './drawers'

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
{:else if $networkConfigRoute === NetworkConfigRoute.EditChain}
    <EditChainSideDrawer />
{:else if $networkConfigRoute === NetworkConfigRoute.RemoveChain}
    <RemoveChainSideDrawer />
{:else if $networkConfigRoute === NetworkConfigRoute.ChainDepositAddress}
    <ChainDepositAddressSideDrawer />
{:else if $networkConfigRoute === NetworkConfigRoute.AddChain}
    <AddChainSideDrawer />
{/if}
