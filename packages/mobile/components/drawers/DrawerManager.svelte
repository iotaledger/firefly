<script lang="ts">
    import ConfirmDrawer from './ConfirmDrawer.svelte'
    import EnterPasswordDrawer from './EnterPasswordDrawer.svelte'
    import SelectedActivityDrawer from './SelectedActivityDrawer.svelte'

    import { closeDrawer, DrawerId, drawersStore } from '../../lib/auxiliary/drawer'

    const COMPONENTS = {
        [DrawerId.Confirm]: ConfirmDrawer,
        [DrawerId.EnterPassword]: EnterPasswordDrawer,
        [DrawerId.SelectedActivity]: SelectedActivityDrawer,
    }
</script>

{#if $drawersStore.length > 0}
    {#each $drawersStore as drawer}
        {@const drawerComponent = COMPONENTS[drawer.id]}
        {#if drawerComponent}
            <svelte:component this={drawerComponent} {...drawer.props} onClose={() => closeDrawer(drawer.id)} />
        {/if}
    {/each}
{/if}
