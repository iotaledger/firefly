<script lang="ts">
    import { onMount } from 'svelte'
    import { ChainType, IscpChain, selectedChain } from '@core/network'
    import { EvmChainInformation, IscpChainInformation } from './components'
    import { Pane } from '@ui'

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

<div class="w-full h-full">
    <Pane>
        {#if chainConfiguration?.type === ChainType.Iscp}
            <IscpChainInformation {chainConfiguration} />
        {:else if chainConfiguration?.type === ChainType.Evm}
            <EvmChainInformation />
        {/if}
    </Pane>
</div>
