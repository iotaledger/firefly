<script lang="typescript">
    import { localize } from '@core/i18n'
    import { InputContainer, Modal, TextInput, AliasSelector } from 'shared/components'

    export let alias: string

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let value: string
    let error: string
    let hasFocus: boolean

    $: hasFocus && (error = '')
    $: value && modal?.open()

    $: if (hasFocus) {
        setTimeout(() => modal?.open(), 101)
    }
</script>

<alias-input class="w-full relative">
    <InputContainer bind:inputElement clearPadding isFocused={hasFocus} {error}>
        <TextInput
            bind:inputElement
            bind:value
            bind:hasFocus
            clearBackground
            clearBorder
            label={localize('popups.mintNativeToken.alias')}
            placeholder={localize('popups.mintNativeToken.alias')}
            fontSize="sm"
            {...$$restProps}
        />
    </InputContainer>
    <AliasSelector bind:modal bind:selected={alias} onClose={() => inputElement.blur()} />
</alias-input>
