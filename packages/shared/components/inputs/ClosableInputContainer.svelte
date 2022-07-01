<script lang="typescript">
    import { Icon, InputContainer } from 'shared/components'

    export let open = false
    export let buttonElement: HTMLButtonElement
    export let hasFocus: boolean
    export let inputElement: HTMLInputElement
    export let onClose: () => unknown

    $: {
        if (inputElement === null && buttonElement) {
            buttonElement.focus()
        }
    }

    function handleClose() {
        open = false
        onClose()
    }
</script>

{#if open}
    <InputContainer bind:inputElement clearPadding isFocused={hasFocus}>
        <slot name="input" />
        <button on:click={handleClose} class="mr-3">
            <Icon
                icon="close"
                classes="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            />
        </button>
    </InputContainer>
{/if}
