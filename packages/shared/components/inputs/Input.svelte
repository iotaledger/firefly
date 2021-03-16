<script lang="typescript">
    import { onMount } from 'svelte'
    import Error from './Error'

    export let value = ''
    export let classes = ''
    export let placeholder = ''
    export let type = 'text'
    export let error
    export let maxlength = null
    export let numeric = false
    export let autofocus = false
    export let submitHandler = undefined
    export let disabled = false

    let inputElement

    const handleInput = (event) => {
        value = event.target.value
    }

    const onKeyPress = (e) => {
        // if the input is numeric, we accept only numbers and enter press
        if (numeric && e.keyCode !== 13 && (e.which < 48 || e.which > 57)) {
            e.preventDefault()
        }
        if (e.keyCode === 13 && submitHandler) {
            submitHandler()
        }
    }

    onMount(() => {
        if (autofocus) {
            inputElement.focus()
        }
    })
</script>

<style type="text/scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        @apply m-0;
    }
    input {
        &.disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
    }
</style>

<div class="w-full">
    <input
        {type}
        {value}
        bind:this={inputElement}
        {maxlength}
        class={`w-full relative text-12 leading-140 py-4 pr-8 pl-4 border border-solid rounded-xl 
            text-gray-500 dark:text-white bg-white dark:bg-gray-800 
            ${error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 dark:focus:border-gray-600'} 
            ${classes}`}
        on:input={handleInput}
        on:keypress={onKeyPress}
        {disabled}
        {placeholder}
        {...$$restProps} />
    <Error {error} />
</div>
