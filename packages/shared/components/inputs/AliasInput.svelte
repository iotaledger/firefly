<script lang="typescript">
    import { Modal, AliasSelector, SelectorInput } from 'shared/components'

    export let alias: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined
</script>

<SelectorInput
    labelLocale="popups.mintNativeToken.property.alias"
    bind:value={alias}
    bind:inputElement
    bind:modal
    {error}
>
    <AliasSelector bind:modal bind:selected={alias} onClose={() => inputElement.blur()} />
</SelectorInput>
