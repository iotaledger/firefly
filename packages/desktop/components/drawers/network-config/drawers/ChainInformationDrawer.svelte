<script lang="ts">
    import { onMount } from 'svelte'
    import { ChainType, IscpChain, selectedChain } from '@core/network'
    import { EvmChainInformation, IscpChainInformation } from './components'
    import { Pane } from '@ui'
    import { Router } from '@core/router'
    import { DrawerRoute } from '@desktop/routers'
    import { DrawerTemplate } from '.'
    import { localize } from '@core/i18n'

    export let drawerRouter: Router<DrawerRoute>

    let chainConfiguration

    function setChainConfiguration(): void {
        if ($selectedChain instanceof IscpChain) {
            chainConfiguration = $selectedChain.getConfiguration()
        }
    }

    onMount(() => {
        setChainConfiguration()
    })
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.chainInformation.title')} {drawerRouter}>
    <div class="w-full h-full">
        <Pane>
            {#if chainConfiguration?.type === ChainType.Iscp}
                <IscpChainInformation {chainConfiguration} />
            {:else if chainConfiguration?.type === ChainType.Evm}
                <EvmChainInformation />
            {/if}
        </Pane>
    </div>
</DrawerTemplate>
