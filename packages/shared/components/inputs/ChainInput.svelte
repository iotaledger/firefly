<script lang="ts">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { IChain, network } from '@core/network'

    let inputElement: HTMLInputElement
    let modal: Modal
    let error: string

    $: chainOptions = getChainOptions($network.getChains())
    $: selected = chainOptions?.[0]

    function getChainOptions(chains: IChain[]): IOption[] {
        return (chains ?? []).map((chain) => {
            const configuration = chain.getConfiguration()
            return { key: configuration.name, value: configuration.chainId.toString() }
        })
    }
</script>

<SelectorInput
    labelLocale="general.chain"
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    options={chainOptions}
    inputClasses="cursor-pointer"
    containerClasses="cursor-pointer"
/>
