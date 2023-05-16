<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Router } from '@core/router'
    import { NetworkConfigRoute, NetworkConfigRouter, networkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import {
        AddChainDrawer,
        ChainDepositAddressDrawer,
        ChainInformationDrawer,
        ConnectedChainsDrawer,
        EditChainDrawer,
        RemoveChainDrawer,
    } from './drawers'
    import { clearSelectedChain } from '@core/network'

    export let drawerRoute: NetworkConfigRoute
    export let drawerRouter: Router<NetworkConfigRoute>

    $: drawerRoute = $networkConfigRoute

    onMount(() => {
        $networkConfigRouter = new NetworkConfigRouter()
        drawerRouter = $networkConfigRouter
    })

    onDestroy(() => {
        $networkConfigRouter = null
        clearSelectedChain()
    })
</script>

{#if $networkConfigRoute === NetworkConfigRoute.ConnectedChains}
    <ConnectedChainsDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ChainInformation}
    <ChainInformationDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.EditChain}
    <EditChainDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.RemoveChain}
    <RemoveChainDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ChainDepositAddress}
    <ChainDepositAddressDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.AddChain}
    <AddChainDrawer {drawerRouter} />
{/if}
