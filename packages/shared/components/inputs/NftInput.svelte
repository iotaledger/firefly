<script lang="typescript">
    import { Modal, NftSelector, SelectorInput } from 'shared/components'

    export let nftId: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined
</script>

<SelectorInput labelLocale="popups.sendNft.property.nft" bind:value={nftId} bind:inputElement bind:modal {error}>
    <NftSelector bind:modal bind:selected={nftId} onClose={() => inputElement.blur()} />
</SelectorInput>
