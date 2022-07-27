<script lang="typescript">
    import { NumberInput, TextInput, ClosableInputContainer } from 'shared/components'

    export let value = ''
    export let open = false
    export let buttonElement: HTMLButtonElement
    export let label: string
    export let placeholder: string
    export let inputType: 'text' | 'number' = 'text'

    let inputElement: HTMLInputElement
    let hasFocus: boolean

    function onClose() {
        value = ''
    }
</script>

<ClosableInputContainer bind:inputElement bind:hasFocus bind:buttonElement bind:open {onClose}>
    <div slot="input" class="w-full">
        {#if inputType === 'text'}
            <TextInput
                bind:value
                bind:inputElement
                bind:hasFocus
                autofocus
                clearBackground
                clearBorder
                {label}
                {placeholder}
                {...$$restProps}
            />
        {:else if inputType === 'number'}
            <NumberInput
                bind:value
                bind:inputElement
                bind:hasFocus
                autofocus
                clearBackground
                clearBorder
                {label}
                {placeholder}
                {...$$restProps}
            />
        {/if}
    </div>
</ClosableInputContainer>
