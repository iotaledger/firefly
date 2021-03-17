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
        class={`w-full text-12 leading-140 py-4 pr-8 pl-4 bg-white border border-solid ${classes} ${error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-500 focus:border-gray-500'} rounded-xl text-gray`}
        on:input={handleInput}
        on:keypress={onKeyPress}
        {disabled}
        {placeholder}
        {...$$restProps} />
    <Error {error} />
</div>
