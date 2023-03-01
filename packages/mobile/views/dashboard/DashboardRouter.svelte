<script lang="ts">
    import { ProfileDrawer } from './drawers'

    import {
        DashboardRoute,
        dashboardRoute,
        profileRouter,
        resetRouterWithDrawerDelay,
        settingsRouter,
    } from '@/routers'
    import features from '@features/features'

    function onProfileDrawerClose(): void {
        $profileRouter.closeDrawer()
        resetRouterWithDrawerDelay($settingsRouter)
    }
</script>

{#if $dashboardRoute === DashboardRoute.Profile && features?.dashboard?.profileActions?.enabled}
    <ProfileDrawer onClose={onProfileDrawerClose} />
{/if}
