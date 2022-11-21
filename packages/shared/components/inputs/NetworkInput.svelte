<script lang="typescript">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { activeProfile } from '@core/profile'
    import { NETWORK_ADDRESS, DestinationNetwork } from '@core/layer-2'

    const readonlyAttribute = $activeProfile?.isDeveloperProfile ? {} : { readonly: true }
    const networkAddresses = NETWORK_ADDRESS[$activeProfile.networkType]

    const LAYER_1_NETWORK_OPTION = {
        key: DestinationNetwork.Shimmer,
        value: networkAddresses[DestinationNetwork.Shimmer],
    }

    export let networkAddress: string = LAYER_1_NETWORK_OPTION.value
    export let showLayer2: boolean = false

    $: networkOptions = showLayer2 ? getLayer2NetworkOptions() : [LAYER_1_NETWORK_OPTION]

    let selected: IOption = LAYER_1_NETWORK_OPTION
    $: if (!showLayer2) {
        selected = LAYER_1_NETWORK_OPTION
    }

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let error: string

    $: networkAddress = selected?.value

    function getLayer2NetworkOptions(): IOption[] {
        return Object.values(DestinationNetwork)
            .filter((_network) => !!networkAddresses[_network])
            .map((_network) => ({
                key: _network,
                value: networkAddresses[_network],
            }))
    }
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
