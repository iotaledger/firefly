<script lang="typescript">
    import { IRouter } from '@core/router/interfaces'
    import features from '@features/features'
    import { onDestroy } from 'svelte'
    import { DRAWER_OUT_ANIMATION_DURATION_MS, selectedActivity } from '../../lib/contexts/dashboard'
    import {
        activityRouter,
        accountSwitcherRouter,
        DashboardRoute,
        dashboardRoute,
        dashboardRouter,
        sendRouter,
    } from '../../lib/routers'
    import { AccountSwitcherDrawer, ActivityDrawer, ProfileActionsDrawer, ReceiveDrawer, SendDrawer } from './drawers'

    $: $selectedActivity && $dashboardRouter.goTo(DashboardRoute.Activity)

    let timeoutId: number

    function onReceiveDrawerClose(): void {
        $dashboardRouter.previous()
    }
    function onSendDrawerClose(): void {
        resetRouterWithDelay($sendRouter)
        $dashboardRouter.previous()
    }
    function onAccountSwitcherDrawerClose(): void {
        resetRouterWithDelay($accountSwitcherRouter)
        $dashboardRouter.previous()
    }
    function onProfileActionsDrawerClose(): void {
        $dashboardRouter.previous()
    }
    function onActivityDrawerClose(): void {
        resetRouterWithDelay($activityRouter)
        $selectedActivity = null
        $dashboardRouter.previous()
    }

    function resetRouterWithDelay(router: IRouter): void {
        const SAFE_DELAY_MS = 50
        timeoutId = setTimeout(() => {
            router?.reset()
        }, DRAWER_OUT_ANIMATION_DURATION_MS + SAFE_DELAY_MS)
    }

    onDestroy(() => {
        clearTimeout(timeoutId)
    })
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
