<script lang="typescript">
    import { Modal, Text, TextType, SelectorInput } from 'shared/components'
    import { activeProfile } from '@core/profile'
    import { DestinationNetwork, NETWORK_ADDRESS } from '@core/network'
    import { truncateString } from '@core/utils'

    export let network: DestinationNetwork = DestinationNetwork.Shimmer
    export let error: string = ''
    export let modal: Modal = undefined

    let inputElement: HTMLInputElement = undefined

    const networks = Object.values(DestinationNetwork)

    function onClick(selectedNetwork: DestinationNetwork): void {
        network = selectedNetwork
    }
</script>

<SelectorInput
    labelLocale="general.destinationNetwork"
    bind:value={network}
    bind:inputElement
    bind:modal
    {error}
    readonly
    options={networks}
    inputClasses="cursor-pointer"
    containerClasses="cursor-pointer"
    {onClick}
    let:option
>
    <Text type={TextType.pre} fontSize="sm" color="gray-800">{option}</Text>
    <Text type={TextType.pre} fontSize="sm" color="gray-600">
        {truncateString(NETWORK_ADDRESS[$activeProfile.networkType][option], 6, 6)}
    </Text>
</SelectorInput>
