<script lang="typescript">
    import { localize } from '@core/i18n'
    import { InputContainer, Modal, TextInput, AliasSelector } from 'shared/components'

    export let alias: string
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    let hasFocus: boolean

    $: hasFocus && (error = '')

    $: if (hasFocus) {
        setTimeout(() => modal?.open(), 101)
    }
</script>

<alias-input class="w-full relative">
    <InputContainer bind:inputElement clearPadding isFocused={hasFocus} {error}>
        <TextInput
            bind:inputElement
            bind:value={alias}
            bind:hasFocus
            clearBackground
            clearBorder
            label={localize('popups.mintNativeToken.property.alias')}
            placeholder={localize('popups.mintNativeToken.property.alias')}
            fontSize="sm"
            {...$$restProps}
        />
    </InputContainer>
    <AliasSelector bind:modal bind:selected={alias} onClose={() => inputElement.blur()} />
</alias-input>
