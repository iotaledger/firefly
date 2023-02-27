<script lang="ts">
    import features from '@features/features'
    import { selectedFilter } from '@/contexts/dashboard'
    import {
        accountActionsRouter,
        accountSwitcherRouter,
        DashboardRoute,
        dashboardRoute,
        dashboardRouter,
        filterRouter,
        profileRouter,
        resetRouterWithDrawerDelay,
        sendRouter,
        settingsRouter,
    } from '@/routers'
    import {
        AccountActionsDrawer,
        AccountSwitcherDrawer,
        ProfileDrawer,
        ReceiveDrawer,
        SendDrawer,
        FilterDrawer,
    } from './drawers'

    $: $selectedFilter && $dashboardRouter.goTo(DashboardRoute.Filter)

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
    function onAccountActionsDrawerClose(): void {
        resetRouterWithDrawerDelay($accountActionsRouter)
        $dashboardRouter.previous()
    }
    function onProfileDrawerClose(): void {
        $profileRouter.closeDrawer()
        resetRouterWithDrawerDelay($settingsRouter)
    }
    function onFilterDrawerClose(): void {
        $filterRouter.closeDrawer()
    }
</script>

{#if $dashboardRoute === DashboardRoute.Receive && features?.dashboard?.receive?.enabled}
    <ReceiveDrawer onClose={onReceiveDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Send && features?.dashboard?.send?.enabled}
    <SendDrawer onClose={onSendDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.AccountSwitcher && features?.dashboard?.accountSwitcher?.enabled}
    <AccountSwitcherDrawer onClose={onAccountSwitcherDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.AccountActions && features?.dashboard?.accountActions?.enabled}
    <AccountActionsDrawer onClose={onAccountActionsDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Profile && features?.dashboard?.profileActions?.enabled}
    <ProfileDrawer onClose={onProfileDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Filter && $selectedFilter}
    <FilterDrawer filter={$selectedFilter} onClose={onFilterDrawerClose} />
{/if}
