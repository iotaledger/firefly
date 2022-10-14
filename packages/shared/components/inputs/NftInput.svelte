<script lang="typescript">
    import { localize } from '@core/i18n'
    import { InputContainer, Modal, TextInput, NftSelector } from 'shared/components'

    export let nftId: string
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let hasFocus: boolean

    $: hasFocus && (error = '')

    $: if (hasFocus) {
        setTimeout(() => modal?.open(), 101)
    }
</script>

<nft-input class="w-full relative">
    <InputContainer bind:inputElement clearPadding isFocused={hasFocus} {error}>
        <TextInput
            bind:inputElement
            bind:value={nftId}
            bind:hasFocus
            clearBackground
            clearBorder
            label={localize('popups.mintNativeToken.property.nft')}
            placeholder={localize('popups.mintNativeToken.property.nft')}
            fontSize="sm"
            {...$$restProps}
        />
    </InputContainer>
    <NftSelector bind:modal bind:selected={nftId} onClose={() => inputElement.blur()} />
</nft-input>
