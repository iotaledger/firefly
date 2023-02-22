<script lang="ts">
    import { Drawer } from '../../components'
    import { closeDrawer, DrawerId, drawers } from '../../lib/auxiliary/drawer'
    import ConfirmDrawer from './ConfirmDrawer.svelte'
    import EnterPasswordDrawer from './EnterPasswordDrawer.svelte'
    import SelectedActivityDrawer from './SelectedActivityDrawer.svelte'

    const COMPONENTS = {
        [DrawerId.Confirm]: ConfirmDrawer,
        [DrawerId.EnterPassword]: EnterPasswordDrawer,
        [DrawerId.SelectedActivity]: SelectedActivityDrawer,
    }
</script>

{#each $drawers as drawer}
    {@const drawerId = drawer.id}
    <Drawer id={drawerId} {...drawer.props} onClose={() => closeDrawer(drawerId)}>
        <svelte:component this={COMPONENTS[drawerId]} {...drawer.props} />
    </Drawer>
{/each}
