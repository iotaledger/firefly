<script lang="ts">
    import { Drawer } from '../../components'
    import { closeDrawer, DrawerId, drawersStore } from '../../lib/auxiliary/drawer'
    import AccountActionsDrawer from './AccountActionsDrawer.svelte'
    import AccountSwitcherDrawer from './AccountSwitcherDrawer.svelte'
    import BalanceBreakdownDrawer from './BalanceBreakdownDrawer.svelte'
    import ConfirmDrawer from './ConfirmDrawer.svelte'
    import CreateAccountDrawer from './CreateAccountDrawer.svelte'
    import CustomizeAccountDrawer from './CustomizeAccountDrawer.svelte'
    import EnterPasswordDrawer from './EnterPasswordDrawer.svelte'
    import ReceiveDrawer from './ReceiveDrawer.svelte'
    import SelectedActivityDrawer from './SelectedActivityDrawer.svelte'
    import SelectedTokenDrawer from './SelectedTokenDrawer.svelte'

    const COMPONENTS = {
        [DrawerId.AccountSwitcher]: AccountSwitcherDrawer,
        [DrawerId.CreateAccount]: CreateAccountDrawer,
        [DrawerId.Confirm]: ConfirmDrawer,
        [DrawerId.EnterPassword]: EnterPasswordDrawer,
        [DrawerId.SelectedActivity]: SelectedActivityDrawer,
        [DrawerId.SelectedToken]: SelectedTokenDrawer,
        [DrawerId.Receive]: ReceiveDrawer,
        [DrawerId.AccountActions]: AccountActionsDrawer,
        [DrawerId.CustomizeAccount]: CustomizeAccountDrawer,
        [DrawerId.BalanceBreakdown]: BalanceBreakdownDrawer,
    }
</script>

{#each $drawersStore as drawer}
    {@const drawerId = drawer.id}
    <Drawer id={drawerId} {...drawer.props} onClose={() => closeDrawer(drawerId)}>
        <svelte:component this={COMPONENTS[drawerId]} {...drawer.props} />
    </Drawer>
{/each}
