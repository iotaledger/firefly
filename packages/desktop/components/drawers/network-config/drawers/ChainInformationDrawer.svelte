<script lang="ts">
    import { ChainType, IChain, network, selectedChainIndex } from '@core/network'
    import { selectedAccount } from '@core/account'
    import { EvmChainInformation, IscpChainInformation, NetworkInformation } from './components'
    import { Pane } from '@ui'

    let chain: IChain

    $: $selectedChainIndex, $selectedAccount, (chain = getChain())
    function getChain(): IChain {
        if ($selectedChainIndex === 0) {
            return undefined
        } else {
            return $network.getChains()[$selectedChainIndex - 1]
        }
    }

    $: chainConfiguration = chain?.getConfiguration()
</script>

<div class="w-full h-full">
    <Pane>
        {#if $selectedChainIndex === 0}
            <NetworkInformation />
        {:else if chainConfiguration?.type === ChainType.Iscp}
            <IscpChainInformation {chainConfiguration} />
        {:else if chainConfiguration?.type === ChainType.Evm}
            <EvmChainInformation />
        {/if}
    </Pane>
</div>
