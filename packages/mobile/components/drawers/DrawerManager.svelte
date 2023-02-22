<script lang="ts">
    import { Drawer } from '../../components'
    import { closeDrawer, DrawerId, drawersStore } from '../../lib/auxiliary/drawer'
    import AccountSwitcherDrawer from './AccountSwitcherDrawer.svelte'
    import ConfirmDrawer from './ConfirmDrawer.svelte'
    import EnterPasswordDrawer from './EnterPasswordDrawer.svelte'
    import SelectedActivityDrawer from './SelectedActivityDrawer.svelte'
    import SelectedTokenDrawer from './SelectedTokenDrawer.svelte'
    import CreateAccountDrawer from './CreateAccountDrawer.svelte'
    import ReceiveDrawer from './ReceiveDrawer.svelte'

    const COMPONENTS = {
        [DrawerId.AccountSwitcher]: AccountSwitcherDrawer,
        [DrawerId.CreateAccount]: CreateAccountDrawer,
        [DrawerId.Confirm]: ConfirmDrawer,
        [DrawerId.EnterPassword]: EnterPasswordDrawer,
        [DrawerId.SelectedActivity]: SelectedActivityDrawer,
        [DrawerId.SelectedToken]: SelectedTokenDrawer,
        [DrawerId.Receive]: ReceiveDrawer,
    }
</script>

{#each $drawersStore as drawer}
    {@const drawerId = drawer.id}
    <Drawer id={drawerId} {...drawer.props} onClose={() => closeDrawer(drawerId)}>
        <svelte:component this={COMPONENTS[drawerId]} {...drawer.props} />
    </Drawer>
{/each}
