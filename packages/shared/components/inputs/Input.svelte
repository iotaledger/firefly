<script lang="typescript">
    import { Error } from 'shared/components'
    import { onMount } from 'svelte'

    export let value = ''
    export let classes = ''
    export let label = undefined
    export let placeholder = undefined
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
        @apply py-4;
        @apply pr-8;
        @apply pl-4;
        border-radius: 0.625rem; // TODO: add to tailwind

        &::placeholder {
            @apply text-gray-500;
        }

        &:disabled {
            &,
            + floating-label.floating-active {
                @apply pointer-events-none;
                @apply opacity-50;
            }
        }

        &.floating-active {
            @apply pt-5;
            @apply pb-3;
        }

        + floating-label {
            transform: translateY(3px);
            transition: all 0.2s ease-out;
            @apply block;
            @apply text-gray-500;
            @apply text-11;
            @apply leading-120;
            @apply overflow-hidden;
            @apply opacity-0;
            @apply pointer-events-none;
            @apply absolute;
            @apply left-4;
            @apply select-none;
            @apply whitespace-nowrap;
            @apply w-full;
            top: 7px;
        }
        &:not(:disabled) {
            + floating-label {
                &.floating-active {
                    @apply opacity-100;
                    transform: none;
                }
            }
        }

        &:focus {
            + floating-label {
                @apply text-blue-500;
            }
        }
    }
</style>

<div class="w-full {classes}">
    <div class="w-full relative">
        <input
            {type}
            {value}
            bind:this={inputElement}
            {maxlength}
            class="w-full text-12 leading-140 border border-solid
                {disabled ? 'text-gray-400 dark:text-gray-700' : 'text-gray-800 dark:text-white'} bg-white dark:bg-gray-800 
                {error ? 'border-red-300 hover:border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600'}"
            class:floating-active={value && label}
            on:input={handleInput}
            on:keypress={onKeyPress}
            {disabled}
            {...$$restProps}
            {placeholder} />
        {#if label}
            <floating-label
                class="block text-gray-500 text-11 leading-120 overflow-hidden opacity-0 pointer-events-none absolute top-2 left-4 select-none whitespace-nowrap w-full"
                class:floating-active={value && label}>
                {label}
            </floating-label>
        {/if}
    </div>
    {#if error}
        <Error {error} />
    {/if}
</div>
