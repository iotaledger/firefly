<script lang="ts">
    import { Drawer } from '@components'
    import { ConfirmDrawer, EnterPasswordDrawer, SelectedActivityDrawer, SelectedTokenDrawer } from './'

    import { closeDrawer, DrawerId, drawers } from '@/auxiliary/drawer'

    const COMPONENTS = {
        [DrawerId.Confirm]: ConfirmDrawer,
        [DrawerId.EnterPassword]: EnterPasswordDrawer,
        [DrawerId.SelectedActivity]: SelectedActivityDrawer,
        [DrawerId.SelectedToken]: SelectedTokenDrawer,
    }
</script>

{#each $drawers as drawer}
    {@const drawerId = drawer.id}
    <Drawer id={drawerId} {...drawer.props} onClose={() => closeDrawer(drawerId)}>
        <svelte:component this={COMPONENTS[drawerId]} {...drawer.props} />
    </Drawer>
{/each}
