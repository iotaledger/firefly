<script lang="typescript">
    import { Modal, SelectorInput } from 'shared/components'
    import { activeProfile } from '@core/profile'
    import { DestinationNetwork, NETWORK_ADDRESS } from '@core/network'

    export let network: DestinationNetwork = DestinationNetwork.Shimmer
    export let error: string = ''
    export let modal: Modal = undefined

    let inputElement: HTMLInputElement = undefined
    let selectedNetwork: { key: string; value: string } = undefined

    const networks = Object.values(DestinationNetwork).map((_network) => ({
        key: _network,
        value: NETWORK_ADDRESS[$activeProfile.networkType][_network],
    }))

    function onClick(selectedNetwork: DestinationNetwork): void {
        network = selectedNetwork
    }
</script>

<SelectorInput
    labelLocale="general.destinationNetwork"
    bind:value={network}
    bind:option={selectedNetwork}
    bind:inputElement
    bind:modal
    {error}
    readonly
    options={networks}
    inputClasses="cursor-pointer"
    containerClasses="cursor-pointer"
    {onClick}
/>
