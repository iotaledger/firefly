<script lang="ts">
    import { AccountActionsDrawer, FilterDrawer, ProfileDrawer, SendDrawer } from './drawers'

    import { selectedFilter } from '@/contexts/dashboard'
    import {
        accountActionsRouter,
        DashboardRoute,
        dashboardRoute,
        dashboardRouter,
        filterRouter,
        profileRouter,
        resetRouterWithDrawerDelay,
        sendRouter,
        settingsRouter,
    } from '@/routers'
    import features from '@features/features'

    $: $selectedFilter && $dashboardRouter.goTo(DashboardRoute.Filter)

    function onSendDrawerClose(): void {
        $sendRouter.closeDrawer()
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

{#if $dashboardRoute === DashboardRoute.Send && features?.dashboard?.send?.enabled}
    <SendDrawer onClose={onSendDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.AccountActions && features?.dashboard?.accountActions?.enabled}
    <AccountActionsDrawer onClose={onAccountActionsDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Profile && features?.dashboard?.profileActions?.enabled}
    <ProfileDrawer onClose={onProfileDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Filter && $selectedFilter}
    <FilterDrawer filter={$selectedFilter} onClose={onFilterDrawerClose} />
{/if}
