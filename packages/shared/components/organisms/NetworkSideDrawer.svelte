<script lang="ts">
    import { isNetworkSideDrawerOpen } from '@core/network/stores/network-side-drawer.store'
    import SideDrawer from 'shared/components/atoms/SideDrawer.svelte'
</script>

{#if $isNetworkSideDrawerOpen}
    <SideDrawer>test</SideDrawer>
{/if}
