<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Router } from '@core/router'
    import { NetworkConfigRoute, networkConfigRoute, NetworkConfigRouter, networkConfigRouter } from '@desktop/routers'
    import {
        AddChainDrawer,
        ChainDepositAddressDrawer,
        ChainInformationDrawer,
        ConfirmLedgerEvmAddressDrawer,
        ConnectedChainsDrawer,
        ConnectLedgerDeviceDrawer,
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
{:else if $networkConfigRoute === NetworkConfigRoute.ConnectLedgerDevice}
    <ConnectLedgerDeviceDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ConfirmLedgerEvmAddress}
    <ConfirmLedgerEvmAddressDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.AddChain}
    <AddChainDrawer {drawerRouter} />
{/if}
