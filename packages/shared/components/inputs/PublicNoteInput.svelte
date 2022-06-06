<script lang="typescript">
    import { localize } from '@core/i18n'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Icon, TextInput, InputContainer, Text } from 'shared/components'

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
            autofocus
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
        class="py-2 px-3 w-max bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600 focus:dark:bg-gray-600 text-gray-600 dark:text-gray-500 rounded-md"
        on:click={handleAddClick}
    >
        <div class="flex flex-row items-center space-x-2">
            <Icon icon="plus" height="10" width="10" classes="text-gray-600" />
            <Text type="p" fontSize="15" color="gray-600">{localize('actions.addPublicNote')}</Text>
        </div>
    </button>
{/if}
