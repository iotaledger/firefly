<script lang="typescript">
    import features from '@features/features'
    import { selectedActivity, selectedAsset } from '../../lib/contexts/dashboard'
    import {
        accountSwitcherRouter,
        activityRouter,
        DashboardRoute,
        dashboardRoute,
        dashboardRouter,
        resetRouterWithDrawerDelay,
        sendRouter,
        tokenRouter,
    } from '../../lib/routers'
    import {
        AccountSwitcherDrawer,
        ActivityDrawer,
        ProfileActionsDrawer,
        ReceiveDrawer,
        SendDrawer,
        TokenDrawer,
    } from './drawers'

    $: $selectedActivity && $dashboardRouter.goTo(DashboardRoute.Activity)
    $: $selectedAsset && $dashboardRouter.goTo(DashboardRoute.Token)

    function onReceiveDrawerClose(): void {
        $dashboardRouter.previous()
    }
    function onSendDrawerClose(): void {
        $sendRouter.closeDrawer()
    }
    function onAccountSwitcherDrawerClose(): void {
        resetRouterWithDrawerDelay($accountSwitcherRouter)
        $dashboardRouter.previous()
    }
    function onProfileActionsDrawerClose(): void {
        $dashboardRouter.previous()
    }
    function onActivityDrawerClose(): void {
        resetRouterWithDrawerDelay($activityRouter)
        $selectedActivity = null
        $dashboardRouter.previous()
    }
    function onTokenDrawerClose(): void {
        resetRouterWithDrawerDelay($tokenRouter)
        $selectedAsset = null
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
{:else if $dashboardRoute === DashboardRoute.Activity && $selectedActivity}
    <ActivityDrawer activity={$selectedActivity} onClose={onActivityDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Token && $selectedAsset}
    <TokenDrawer asset={$selectedAsset} onClose={onTokenDrawerClose} />
{/if}
