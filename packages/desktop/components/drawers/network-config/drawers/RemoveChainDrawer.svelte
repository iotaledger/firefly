<script lang="ts">
    import { localize } from '@core/i18n'
    import { DrawerTemplate } from '.'
    import { Router } from '@core/router'
    import { DrawerRoute } from '@desktop/routers'

    export let drawerRouter: Router<DrawerRoute>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.removeChain.title')} {drawerRouter}>
    <remove-chain-drawer class="flex flex-col justify-between mb-6"> Remove chain </remove-chain-drawer>
</DrawerTemplate>
