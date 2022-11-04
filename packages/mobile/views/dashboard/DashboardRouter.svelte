<script lang="typescript">
    import features from '../../features/features'
    import {
        accountSwitcherRouter,
        DashboardRoute,
        dashboardRoute,
        dashboardRouter,
        sendRouter,
    } from '../../lib/routers'
    import { AccountSwitcherDrawer, ProfileActionsDrawer, ReceiveDrawer, SendDrawer } from './drawers'

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
    function onProfileActionsDrawerClose(): void {
        $dashboardRouter.previous()
    }
</script>

{#if $dashboardRoute === DashboardRoute.Receive && features?.dashboard?.receive?.enabled}
    <ReceiveDrawer onClose={onReceiveDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Send && features?.dashboard?.send?.enabled}
    <SendDrawer onClose={onSendDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.AccountSwitcher && features?.dashboard?.accountSwitcher?.enabled}
    <AccountSwitcherDrawer onClose={onAccountSwitcherDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.ProfileActions && features?.dashboard?.profileActions?.enabled}
    <ProfileActionsDrawer onClose={onProfileActionsDrawerClose} />
{/if}
