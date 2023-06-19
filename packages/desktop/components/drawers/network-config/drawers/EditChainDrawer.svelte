<script lang="ts">
    import { localize } from '@core/i18n'
    import { DrawerTemplate } from '.'
    import { Router } from '@core/router'
    import { DrawerRoute } from '@desktop/routers'

    export let drawerRouter: Router<DrawerRoute>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.editChain.title')} {drawerRouter}>
    <edit-chain-drawer class="flex flex-col justify-between mb-6"> Edit chain </edit-chain-drawer>
</DrawerTemplate>
