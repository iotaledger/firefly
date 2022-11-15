<script lang="typescript">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { activeProfile } from '@core/profile'
    import { DestinationNetwork } from '@core/network'
    import { NETWORK_ADDRESS } from '@core/layer-2'

    export let networkAddress: string = NETWORK_ADDRESS[DestinationNetwork.Shimmer]

    const readonlyAttribute = $activeProfile?.isDeveloperProfile ? {} : { readonly: true }
    const networksAddresses = NETWORK_ADDRESS[$activeProfile.networkType]

    const networkOptions: IOption[] = Object.values(DestinationNetwork)
        .filter((_network) => !!networksAddresses[_network])
        .map((_network) => ({
            key: _network,
            value: networksAddresses[_network],
        }))

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let error: string
    let selected: IOption = {
        key: networkOptions.find(({ key }) => NETWORK_ADDRESS[key] === networkAddress).key,
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
