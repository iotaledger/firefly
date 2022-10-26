<script lang="typescript">
    import features from '../../features/features'
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
        $dashboardRouter.previous()
        $sendRouter.reset()
    }
    function onAccountSwitcherDrawerClose(): void {
        $dashboardRouter.previous()
        $accountSwitcherRouter.reset()
    }
</script>

{#if $dashboardRoute === DashboardRoute.Receive && features?.dashboard?.receive?.enabled}
    <ReceiveDrawer onClose={onReceiveDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Send && features?.dashboard?.send?.enabled}
    <SendDrawer onClose={onSendDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.AccountSwitcher && features?.dashboard?.accountSwitcher?.enabled}
    <AccountSwitcherDrawer onClose={onAccountSwitcherDrawerClose} />
{/if}
