<script lang="ts">
    import { Drawer } from '../../components'
    import { closeDrawer, DrawerId, drawers } from '../../lib/auxiliary/drawer'
    import { ConfirmDrawer, EnterPasswordDrawer, SelectedActivityDrawer } from './'

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
