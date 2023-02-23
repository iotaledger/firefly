<script lang="ts">
    import features from '@features/features'
    import {
        DashboardRoute,
        dashboardRoute,
        profileRouter,
        resetRouterWithDrawerDelay,
        sendRouter,
        settingsRouter,
    } from '../../lib/routers'
    import { ProfileDrawer, SendDrawer } from './drawers'

    function onSendDrawerClose(): void {
        $sendRouter.closeDrawer()
    }
    function onProfileDrawerClose(): void {
        $profileRouter.closeDrawer()
        resetRouterWithDrawerDelay($settingsRouter)
    }
</script>

{#if $dashboardRoute === DashboardRoute.Send && features?.dashboard?.send?.enabled}
    <SendDrawer onClose={onSendDrawerClose} />
{:else if $dashboardRoute === DashboardRoute.Profile && features?.dashboard?.profileActions?.enabled}
    <ProfileDrawer onClose={onProfileDrawerClose} />
{/if}
