<script lang="ts">
    import { localize } from '@core/i18n'
    import DrawerTemplate from './DrawerTemplate.svelte'
    import { AddIscpChainForm } from './components'
    import { Router } from '@core/router'
    import { DrawerRoute } from '@desktop/routers'

    export let drawerRouter: Router<DrawerRoute>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.addChain.title')} {drawerRouter}>
    <add-chain-drawer>
        <AddIscpChainForm />
    </add-chain-drawer>
</DrawerTemplate>
