<script lang="ts">
    import { MeatballMenuButton } from '@ui'
    import { DashboardRoute, dashboardRouter } from '@/routers'
</script>

<MeatballMenuButton
    onClick={() => $dashboardRouter.goTo(DashboardRoute.AccountActions)}
    classes="items-center text-gray-500"
/>
