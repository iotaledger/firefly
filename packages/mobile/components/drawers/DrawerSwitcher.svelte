<script lang="ts">
    import ConfirmDrawer from './ConfirmDrawer.svelte'
    import EnterPasswordDrawer from './EnterPasswordDrawer.svelte'
    import SelectedActivityDrawer from './SelectedActivityDrawer.svelte'

    import { DrawerId, drawersStore, closeDrawer } from '../../lib/auxiliary/drawer'

    const drawerComponents = {
        [DrawerId.Confirm]: ConfirmDrawer,
        [DrawerId.EnterPassword]: EnterPasswordDrawer,
        [DrawerId.SelectedActivity]: SelectedActivityDrawer,
    }
</script>

{#if $drawersStore.length > 0}
    {#each $drawersStore as drawer}
        <svelte:component this={drawerComponents[drawer.id]} {...drawer.props} onClose={() => closeDrawer(drawer.id)} />
    {/each}
{/if}
