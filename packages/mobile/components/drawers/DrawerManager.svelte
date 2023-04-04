<script lang="ts">
    import { get } from 'svelte/store'

    import { Drawer } from '@components'
    import {
        AccountActionsDrawer,
        AccountSwitcherDrawer,
        BalanceBreakdownDrawer,
        BurnNativeTokensDrawer,
        ConfirmDrawer,
        CreateAccountDrawer,
        CustomizeAccountDrawer,
        DateTimePickerDrawer,
        DeleteAccountDrawer,
        EnterPasswordDrawer,
        ExpirationDrawer,
        FilterDrawer,
        LegalDrawer,
        LegalUpdateDrawer,
        NetworkStatusDrawer,
        ProfileDrawer,
        ReceiveDrawer,
        ReferencesDrawer,
        SelectedActivityDrawer,
        SelectedTokenDrawer,
        SendDrawer,
    } from './'

    import { closeDrawer, DrawerId, drawers, getDrawerRouter } from '@/auxiliary/drawer'
    import { profileRouter, sendRouter } from '@/routers'

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
        [DrawerId.Send]: SendDrawer,
        [DrawerId.References]: ReferencesDrawer,
        [DrawerId.Expiration]: ExpirationDrawer,
        [DrawerId.Profile]: ProfileDrawer,
        [DrawerId.NetworkStatus]: NetworkStatusDrawer,
        [DrawerId.LegalUpdate]: LegalUpdateDrawer,
        [DrawerId.Legal]: LegalDrawer,
        [DrawerId.BurnNativeTokens]: BurnNativeTokensDrawer,
    }

    function onClose(drawerId: DrawerId): void {
        if (drawerId === DrawerId.Profile) {
            $profileRouter.closeDrawer()
        } else if (drawerId === DrawerId.Send) {
            $sendRouter.closeDrawer()
        } else {
            closeDrawer(drawerId)
        }
    }
    function onBack(drawerId: DrawerId): void {
        const drawerRouter = get(getDrawerRouter(drawerId))
        if (drawerRouter) {
            drawerRouter.previous()
        }
    }
</script>

{#each $drawers as drawer}
    {@const drawerId = drawer.id}
    <Drawer id={drawerId} {...drawer.props} onClose={() => onClose(drawerId)} onBack={() => onBack(drawerId)}>
        <svelte:component this={COMPONENTS[drawerId]} {...drawer.props} />
    </Drawer>
{/each}
