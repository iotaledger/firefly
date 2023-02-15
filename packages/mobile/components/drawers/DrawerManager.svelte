<script lang="ts">
    import { Drawer } from '../../components'
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

{#each $drawersStore as drawer}
    <Drawer {...drawer.props} onClose={() => closeDrawer(drawer.id)}>
        <svelte:component this={COMPONENTS[drawer.id]} {...drawer.props} />
    </Drawer>
{/each}
