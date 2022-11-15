<script lang="typescript">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { activeProfile } from '@core/profile'
    import { NETWORK_ADDRESS, DestinationNetwork } from '@core/layer-2'

    const readonlyAttribute = $activeProfile?.isDeveloperProfile ? {} : { readonly: true }
    const networkAddresses = NETWORK_ADDRESS[$activeProfile.networkType]

    export let networkAddress: string = networkAddresses[DestinationNetwork.Shimmer]

    const networkOptions: IOption[] = Object.values(DestinationNetwork)
        .filter((_network) => !!networkAddresses[_network])
        .map((_network) => ({
            key: _network,
            value: networkAddresses[_network],
        }))

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let error: string
    let selected: IOption = {
        key: networkOptions.find(({ key }) => networkAddresses[key] === networkAddress)?.key,
        value: networkAddress,
    }

    $: networkAddress = selected?.value
</script>

<SelectorInput
    labelLocale="general.destinationNetwork"
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    options={networkOptions}
    {...readonlyAttribute}
    inputClasses="cursor-pointer"
    containerClasses="cursor-pointer"
/>
