<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Icon, TextInput, InputContainer } from 'shared/components'

    export let value = ''

    let active = false
    let hasFocus: boolean
    let inputElement: HTMLInputElement
    let buttonElement: HTMLButtonElement

    $: {
        if (!hasFocus && !value) {
            active = false
            value = ''
        }
    }

    $: {
        if (inputElement === null && buttonElement) {
            buttonElement.focus()
        }
    }

    function handleDelete() {
        active = false
        value = ''
    }

    function handleAddClick() {
        active = true
    }
</script>

{#if active}
    <InputContainer bind:inputElement clearPadding isFocused={hasFocus}>
        <TextInput
            bind:value
            bind:inputElement
            bind:hasFocus
            autofocus={true}
            clearBackground
            clearBorder
            label={localize('general.optionalPublicNote')}
            placeholder={localize('general.optionalPublicNote')}
            fontSize="sm"
        />
        <button on:click={handleDelete} class="mr-3">
            <Icon
                icon="close"
                classes="text-gray-500 hover:text-gray-600 dark:text-gray-400 hover:dark:text-gray-300"
            />
        </button>
    </InputContainer>
{:else}
    <button
        bind:this={buttonElement}
        class="text-12 p-2 w-max bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600 focus:dark:bg-gray-600 text-gray-600 dark:text-gray-500 rounded-md"
        on:click={handleAddClick}
    >
        <span class="mr-1">+</span>{localize('actions.addPublicNote')}
    </button>
{/if}
