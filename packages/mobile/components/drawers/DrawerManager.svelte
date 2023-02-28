<script lang="ts">
    import { Drawer } from '@components'
    import {
        AccountActionsDrawer,
        AccountSwitcherDrawer,
        BalanceBreakdownDrawer,
        ConfirmDrawer,
        CreateAccountDrawer,
        CustomizeAccountDrawer,
        DateTimePickerDrawer,
        DeleteAccountDrawer,
        EnterPasswordDrawer,
        FilterDrawer,
        ReceiveDrawer,
        SelectedActivityDrawer,
        SelectedTokenDrawer,
    } from './'

    import { closeDrawer, DrawerId, drawers } from '@/auxiliary/drawer'

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
        [DrawerId.DeleteAccount]: DeleteAccountDrawer,
        [DrawerId.Filter]: FilterDrawer,
        [DrawerId.DateTimePicker]: DateTimePickerDrawer,
    }
</script>

{#each $drawers as drawer}
    {@const drawerId = drawer.id}
    <Drawer id={drawerId} {...drawer.props} onClose={() => closeDrawer(drawerId)}>
        <svelte:component this={COMPONENTS[drawerId]} {...drawer.props} />
    </Drawer>
{/each}
