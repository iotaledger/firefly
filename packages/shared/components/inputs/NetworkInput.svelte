<script lang="typescript">
    import { DestinationNetwork } from '@core/network'
    import { Modal, NetworkSelector, SelectorInput } from 'shared/components'

    export let network: DestinationNetwork = DestinationNetwork.Shimmer
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined
</script>

<SelectorInput labelLocale="general.network" bind:value={network} bind:inputElement bind:modal {error} readonly>
    <NetworkSelector bind:modal bind:selected={network} onClose={() => inputElement.blur()} />
</SelectorInput>
