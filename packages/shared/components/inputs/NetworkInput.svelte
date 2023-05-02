<script lang="ts">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { activeProfile, getNetworkHrp } from '@core/profile'
    import { DEFAULT_CHAINS, DestinationNetwork } from '@core/layer-2'
    import { validateBech32Address } from '@core/utils'

    const readonlyAttribute = $activeProfile?.isDeveloperProfile ? {} : { readonly: true }
    const networkAddresses = DEFAULT_CHAINS[$activeProfile?.network?.id]

    const LAYER_1_NETWORK_OPTION = {
        key: DestinationNetwork.Shimmer,
        value: networkAddresses[DestinationNetwork.Shimmer],
    }

    export let networkAddress: string = LAYER_1_NETWORK_OPTION.value
    export let showLayer2: boolean = false

    $: networkOptions = showLayer2 ? getLayer2NetworkOptions() : [LAYER_1_NETWORK_OPTION]

    let selected: IOption =
        getLayer2NetworkOptions().find((option) => option.value === networkAddress) ?? LAYER_1_NETWORK_OPTION
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

    export function validate(): Promise<void> {
        try {
            if (networkAddress !== networkAddresses[DestinationNetwork.Shimmer]) {
                validateBech32Address(getNetworkHrp(), networkAddress)
            }
            return Promise.resolve()
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
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
