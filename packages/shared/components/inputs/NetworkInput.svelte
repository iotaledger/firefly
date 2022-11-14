<script lang="typescript">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { activeProfile } from '@core/profile'
    import { DestinationNetwork, NETWORK_ADDRESS } from '@core/network'

    export let network: DestinationNetwork = DestinationNetwork.Shimmer
    export let error: string = ''
    export let modal: Modal = undefined

    const networksAddresses = NETWORK_ADDRESS[$activeProfile.networkType]

    let inputElement: HTMLInputElement = undefined
    let selected: IOption = {
        key: network,
        value: networksAddresses[network],
    }

    const networks: IOption[] = Object.values(DestinationNetwork)
        .filter((_network) => !!networksAddresses[_network])
        .map((_network) => ({
            key: _network,
            value: networksAddresses[_network],
        }))

    $: network = selected?.key
</script>

<SelectorInput
    labelLocale="general.destinationNetwork"
    bind:selected
    bind:inputElement
    bind:modal
    {error}
    options={networks}
    inputClasses="cursor-pointer"
    containerClasses="cursor-pointer"
/>
