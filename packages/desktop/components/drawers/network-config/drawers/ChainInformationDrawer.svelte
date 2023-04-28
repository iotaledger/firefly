<script lang="ts">
    import { ChainType, IChain, network, selectedChainIndex } from '@core/network'
    import { selectedAccount } from '@core/account'
    import { IscpChainInformation, NetworkInformation } from './components'

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

<div class="w-full h-full flex items-center justify-center">
    {#if $selectedChainIndex === 0}
        <NetworkInformation />
    {:else if chainConfiguration?.type === ChainType.Iscp}
        <IscpChainInformation {chainConfiguration} />
    {:else}
        <!-- else content here -->
    {/if}
</div>
