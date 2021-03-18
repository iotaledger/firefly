<script lang="typescript">
    import { onMount } from 'svelte'
    import Error from './Error'

    export let value = ''
    export let classes = ''
    export let placeholder = ''
    export let type = 'text'
    export let error
    export let maxlength = null
    export let float = false
    export let integer = false
    export let autofocus = false
    export let submitHandler = undefined
    export let disabled = false

    let inputElement

    const handleInput = (e) => {
        value = e.target.value
    }

    const onKeyPress = (e) => {
        if (e.keyCode !== 8) {
            const isReturn = e.keyCode === 13
            if (isReturn && submitHandler) {
                submitHandler()
            }
            if (maxlength && value.length >= maxlength) {
                e.preventDefault()
            }
            if ((float || integer) && !isReturn) {
                // if the input is float, we accept one dot
                if (float && (e.keyCode === 46 || e.keyCode === 190)) {
                    if (value.indexOf('.') >= 0) {
                        e.preventDefault()
                    }
                } else if (e.keyCode < 48 || e.keyCode > 57) {
                    // if float or interger we accept numbers
                    e.preventDefault()
                }
            }
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
        class={`w-full text-12 leading-140 py-4 pr-8 pl-4 border border-solid rounded-xl 
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
