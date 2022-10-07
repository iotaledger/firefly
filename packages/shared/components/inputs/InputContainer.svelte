<script lang="typescript">
    import { Box } from 'shared/components/atoms'
    import { Error } from 'shared/components/'
    import { clickOutside } from '@lib/actions'
    import { createEventDispatcher } from 'svelte'

    export let inputElement: HTMLInputElement = undefined

    export let isFocused: boolean = false
    export let error: string = ''
    export let classes: string = ''
    export let backgroundColor = 'white'
    export let darkBackgroundColor = 'gray-800'
    export let clearBackground = false
    export let clearPadding = false
    export let clearBorder = false

    const tabindex = Object.keys($$slots) ? -1 : 0 // if the slot is not empty then makes the button not tabbable
    const dispatch = createEventDispatcher()

    function handleClickOutside(): void {
        dispatch('clickOutside')
    }
</script>

<div class="w-full flex flex-col space-y-1" use:clickOutside on:clickOutside={handleClickOutside}>
    <button
        class="cursor-text w-full flex flex-row"
        type="button"
        on:click={() => {
            inputElement && inputElement.focus()
        }}
        {tabindex}
    >
        <Box
            on:click
            {clearBackground}
            {clearPadding}
            {backgroundColor}
            {darkBackgroundColor}
            classes="w-full flex 
                {!clearPadding ? 'p-4' : ''}
                {!clearBorder ? 'border border-solid' : ''}
                {classes}
                {isFocused
                ? 'border-blue-500'
                : error
                ? 'border-red-300 hover:border-red-500'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600'}"
            {...$$restProps}
        >
            <slot />
        </Box>
    </button>
    {#if error}
        <Error {error} />
    {/if}
</div>
