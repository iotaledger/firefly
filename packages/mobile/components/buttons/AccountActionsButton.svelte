<script lang="ts">
    import { MeatballMenuButton } from 'shared/components'
    import { DashboardRoute, dashboardRouter } from '../../lib/routers'
</script>

<MeatballMenuButton
    onClick={() => $dashboardRouter.goTo(DashboardRoute.AccountActions)}
    classes="items-center text-gray-500"
/>
