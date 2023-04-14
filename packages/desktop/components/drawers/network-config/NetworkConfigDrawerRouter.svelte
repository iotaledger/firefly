<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { NetworkConfigRoute, NetworkConfigRouter, networkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { ConnectedChainsSideDrawer } from './drawers'

    onMount(() => {
        $networkConfigRouter = new NetworkConfigRouter()
    })

    onDestroy(() => {
        $networkConfigRouter = null
    })
</script>

{#if $networkConfigRoute === NetworkConfigRoute.ConnectedChains}
    <ConnectedChainsSideDrawer />
{/if}
