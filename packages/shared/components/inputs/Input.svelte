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
        margin: 0;
    }
    input {
        padding: 15px 40px 16px 13px;
        color: var(--text-secondary-color);
        background: var(--element-bg-color);
        border-radius: 10px;
        box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
        transition: border-color 0.25s;

        &:disabled {
            @apply pointer-events-none;
            @apply bg-gray-100;
        }
    }
</style>

<div class={'w-full'}>
    <input
        {type}
        {value}
        bind:this={inputElement}
        {maxlength}
        class={`w-full relative text-12 leading-140 py-4 pr-8 pl-4 bg-white border border-solid ${classes} ${error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-500 focus:border-gray-500'} rounded-xl text-gray`}
        on:input={handleInput}
        on:keypress={onKeyPress}
        {disabled}
        {placeholder}
        {...$$restProps} />
    <Error {error} />
</div>
