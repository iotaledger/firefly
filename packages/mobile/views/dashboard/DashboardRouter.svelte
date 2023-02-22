<script lang="ts">
    import features from '@features/features'
    import { selectedFilter } from '../../lib/contexts/dashboard'
    import {
        DashboardRoute,
        dashboardRoute,
        dashboardRouter,
        filterRouter,
        profileRouter,
        resetRouterWithDrawerDelay,
        sendRouter,
        settingsRouter,
    } from '../../lib/routers'
    import { FilterDrawer, ProfileDrawer, SendDrawer } from './drawers'

    $: $selectedFilter && $dashboardRouter.goTo(DashboardRoute.Filter)

    function onSendDrawerClose(): void {
        $sendRouter.closeDrawer()
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
{:else if $dashboardRoute === DashboardRoute.Profile && features?.dashboard?.profileActions?.enabled}
    <ProfileDrawer onClose={onProfileDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Filter && $selectedFilter}
    <FilterDrawer filter={$selectedFilter} onClose={onFilterDrawerClose} />
{/if}
