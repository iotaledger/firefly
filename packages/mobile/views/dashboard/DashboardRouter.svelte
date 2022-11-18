<script lang="typescript">
    import features from '@features/features'
    import {
        accountSwitcherRouter,
        activityRouter,
        DashboardRoute,
        dashboardRoute,
        dashboardRouter,
        sendRouter,
    } from '../../lib/routers'
    import { selectedActivity } from '../../lib/wallet'
    import { AccountSwitcherDrawer, ActivityDrawer, ProfileActionsDrawer, ReceiveDrawer, SendDrawer } from './drawers'

    $: $selectedActivity && $dashboardRouter.goTo(DashboardRoute.Activity)

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
    function onActivityDrawerClose(): void {
        $selectedActivity = null
        $activityRouter.reset()
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
{:else if $dashboardRoute === DashboardRoute.Activity && features?.dashboard?.activity?.details?.enabled}
    <ActivityDrawer onClose={onActivityDrawerClose} />
{/if}
