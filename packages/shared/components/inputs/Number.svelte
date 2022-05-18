<script lang="typescript">
    import { Error, Icon } from 'shared/components'
    import { onMount } from 'svelte'

    export let value = 0
    export let autofocus = false
    export let classes = ''
    export let error = ''
    export let disabled = false
    export let min = 0
    export let max = 0

    let input

    onMount(() => {
        if (autofocus) {
            input.focus()
        }
    })

    const handleInput = (e) => {
        const element = e.currentTarget as HTMLInputElement
        validate(element.value)
    }

    const handleValueChange = (increment: number) => {
        if ('number' !== typeof value) value = 0
        else value += increment
    }

    function validate(_value) {
        if ('number' === typeof _value && String(_value).length >= 1) value = Math.min(Math.max(_value, min), max)
    }
</script>

<div class="flex flex-row {disabled && 'opacity-50'} {classes}">
    <button
        {disabled}
        class="group flex items-center justify-center w-8 h-10 border border-solid border-gray-300 dark:border-gray-700"
        on:click={() => handleValueChange(-1)}
    >
        <Icon
            width={16}
            height={16}
            classes="text-gray-500 dark:text-gray-100 group-hover:text-blue-500"
            icon="minus"
        />
    </button>
    <input
        class="px-4 text-center text-12 font-700 bg-transparent border-t border-b border-solid border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
        bind:this={input}
        type="number"
        on:input={handleInput}
        bind:value
        {disabled}
        {min}
        {max}
    />
    <button
        {disabled}
        class="group flex items-center justify-center w-8 h-10 border border-solid border-gray-300 dark:border-gray-700"
        on:click={() => handleValueChange(1)}
    >
        <Icon width={10} height={10} icon="plus" classes="text-gray-500 dark:text-gray-100 group-hover:text-blue-500" />
    </button>
</div>

{#if error}
    <Error {error} />
{/if}

<style type="text/scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        @apply m-0;
    }

    button {
        border-radius: 10px 0 0 10px;
        &:nth-last-of-type(1) {
            border-radius: 0 10px 10px 0;
        }
    }
</style>
