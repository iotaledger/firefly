<script lang="ts">
    import { NumberInput, TextInput, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let value = ''
    export let open = false
    export let buttonElement: HTMLButtonElement = undefined
    export let label: string
    export let placeholder: string
    export let error: string
    export let inputType: 'text' | 'number' = 'text'

    let inputElement: HTMLInputElement
    let hasFocus: boolean

    $: if (inputElement === null && buttonElement) {
        buttonElement.focus()
    }

    function onCloseClick(): void {
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
            <button slot="right-full-h" on:click={onCloseClick}>
                <Icon
                    icon={IconEnum.Close}
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
            <button slot="right-full-h" on:click={onCloseClick}>
                <Icon
                    icon={IconEnum.Close}
                    classes="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                />
            </button>
        </NumberInput>
    {/if}
{/if}
