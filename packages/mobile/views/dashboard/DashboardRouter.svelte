<script lang="typescript">
    import features from '@features/features'
    import { selectedActivity, selectedAsset } from '../../lib/contexts/dashboard'
    import {
        accountSwitcherRouter,
        activityRouter,
        DashboardRoute,
        dashboardRoute,
        dashboardRouter,
        profileRouter,
        resetRouterWithDrawerDelay,
        sendRouter,
        tokenRouter,
    } from '../../lib/routers'
    import {
        AccountSwitcherDrawer,
        ActivityDrawer,
        ProfileDrawer,
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
    function onProfileDrawerClose(): void {
        $profileRouter.closeDrawer()
    }
    function onActivityDrawerClose(): void {
        resetRouterWithDrawerDelay($activityRouter)
        $selectedActivity = null
        $dashboardRouter.previous()
    }
    function onTokenDrawerClose(): void {
        $tokenRouter.closeDrawer()
    }
</script>

{#if $dashboardRoute === DashboardRoute.Receive && features?.dashboard?.receive?.enabled}
    <ReceiveDrawer onClose={onReceiveDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Send && features?.dashboard?.send?.enabled}
    <SendDrawer onClose={onSendDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.AccountSwitcher && features?.dashboard?.accountSwitcher?.enabled}
    <AccountSwitcherDrawer onClose={onAccountSwitcherDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Profile && features?.dashboard?.profileActions?.enabled}
    <ProfileDrawer onClose={onProfileDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Activity && $selectedActivity}
    <ActivityDrawer activity={$selectedActivity} onClose={onActivityDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Token && $selectedAsset}
    <TokenDrawer asset={$selectedAsset} onClose={onTokenDrawerClose} />
{/if}
