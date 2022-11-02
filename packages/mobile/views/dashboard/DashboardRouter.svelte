<script lang="typescript">
    import features from '@features/features'
    import {
        accountSwitcherRouter,
        dashboardRoute,
        DashboardRoute,
        dashboardRouter,
        sendRouter,
    } from '../../lib/routers'
    import { AccountSwitcherDrawer, ReceiveDrawer, SendDrawer } from './drawers'

    function onReceiveDrawerClose(): void {
        $dashboardRouter.previous()
    }
    function onSendDrawerClose(): void {
        $sendRouter.reset()
        $dashboardRouter.previous()
    }
    function onAccountSwitcherDrawerClose(): void {
        $accountSwitcherRouter.reset()
        $dashboardRouter.previous()
    }
</script>

{#if $dashboardRoute === DashboardRoute.Receive && features?.dashboard?.receive?.enabled}
    <ReceiveDrawer onClose={onReceiveDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Send && features?.dashboard?.send?.enabled}
    <SendDrawer onClose={onSendDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.AccountSwitcher && features?.dashboard?.accountSwitcher?.enabled}
    <AccountSwitcherDrawer onClose={onAccountSwitcherDrawerClose} />
{/if}
