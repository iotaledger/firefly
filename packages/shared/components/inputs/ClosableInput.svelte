<script lang="typescript">
    import { NumberInput, TextInput, Icon } from 'shared/components'

    export let value = ''
    export let open = false
    export let buttonElement: HTMLButtonElement
    export let label: string
    export let placeholder: string
    export let error: string
    export let inputType: 'text' | 'number' = 'text'

    let inputElement: HTMLInputElement
    let hasFocus: boolean

    $: if (inputElement === null && buttonElement) {
        buttonElement.focus()
    }

    function handleClose() {
        open = false
        value = ''
    }
</script>

{#if open}
    {#if inputType === 'text'}
        <TextInput
            slot="input"
            bind:value
            bind:inputElement
            bind:hasFocus
            autofocus
            {error}
            {label}
            {placeholder}
            {...$$restProps}
        >
            <button on:click={handleClose}>
                <Icon
                    icon="close"
                    classes="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                />
            </button>
        </TextInput>
    {:else if inputType === 'number'}
        <NumberInput
            slot="input"
            bind:value
            bind:inputElement
            bind:hasFocus
            autofocus
            {error}
            {label}
            {placeholder}
            {...$$restProps}
        >
            <button on:click={handleClose}>
                <Icon
                    icon="close"
                    classes="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                />
            </button>
        </NumberInput>
    {/if}
{/if}
