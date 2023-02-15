<script lang="ts">
    import { localize } from '@core/i18n'
    import { Drawer } from '../../components'
    import { closeDrawer, DrawerId, drawersStore } from '../../lib/auxiliary/drawer'
    import ConfirmDrawer from './ConfirmDrawer.svelte'
    import EnterPasswordDrawer from './EnterPasswordDrawer.svelte'
    import SelectedActivityDrawer from './SelectedActivityDrawer.svelte'

    const COMPONENTS = {
        [DrawerId.Confirm]: ConfirmDrawer,
        [DrawerId.EnterPassword]: EnterPasswordDrawer,
        [DrawerId.SelectedActivity]: SelectedActivityDrawer,
    }

    function getStaticTitle(drawerId: DrawerId): string {
        switch (drawerId) {
            case DrawerId.EnterPassword:
                return localize('popups.password.title')
            case DrawerId.SelectedActivity:
                return localize('popups.transactionDetails.title')
            default:
                return undefined
        }
    }
</script>

{#each $drawersStore as drawer}
    {@const drawerId = drawer.id}
    <Drawer title={getStaticTitle(drawerId)} {...drawer.props} onClose={() => closeDrawer(drawerId)}>
        <svelte:component this={COMPONENTS[drawerId]} {...drawer.props} />
    </Drawer>
{/each}
