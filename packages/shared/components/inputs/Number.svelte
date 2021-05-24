<script lang="typescript">
    import { Icon } from 'shared/components'
    import { onMount } from 'svelte'

    export let value = 0
    export let autofocus = false
    export let min = 0
    export let max = 2147483647
    export let classes = ''

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

    function validate(_value) {
        if (isNaN(_value)) {
            value = value
        }
        _value = parseInt(_value)

        if (typeof min === 'number') {
            _value = Math.max(_value, min)
        }
        if (typeof max === 'number') {
            _value = Math.min(_value, max)
        }
        value = _value
    }
</script>

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

<div class="flex flex-row {classes}">
    <button
        class="group flex items-center justify-center w-8 h-10 border border-solid border-gray-300 dark:border-gray-700"
        on:click={() => validate(value + 1)}>
        <Icon width={16} height={16} classes="text-gray-500 dark:text-gray-100 group-hover:text-blue-500" icon="plus" />
    </button>
    <input
        class="px-4 text-center text-12 font-700 bg-transparent border-t border-b border-solid border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
        bind:this={input}
        type="number"
        on:input={handleInput}
        bind:value
        {min}
        {max} />
    <button
        disabled={typeof value !== 'number'}
        class="group flex items-center justify-center w-8 h-10 border border-solid border-gray-300 dark:border-gray-700"
        on:click={() => validate(value - 1)}>
        <Icon width={16} height={16} icon="minus" classes="text-gray-500 dark:text-gray-100 group-hover:text-blue-500" />
    </button>
</div>
