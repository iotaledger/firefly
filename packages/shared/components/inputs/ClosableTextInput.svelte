<script lang="typescript">
    import { TextInput, ClosableInputContainer } from 'shared/components'

    export let value = ''
    export let open = false
    export let buttonElement: HTMLButtonElement
    export let label: string
    export let placeholder: string

    let inputElement: HTMLInputElement
    let hasFocus: boolean

    function onClose() {
        value = ''
    }
</script>

<ClosableInputContainer bind:inputElement bind:hasFocus bind:buttonElement bind:open {onClose}>
    <TextInput
        slot="input"
        bind:value
        bind:inputElement
        bind:hasFocus
        autofocus
        clearBackground
        clearBorder
        {label}
        {placeholder}
        fontSize="sm"
        {...$$restProps}
    />
</ClosableInputContainer>
