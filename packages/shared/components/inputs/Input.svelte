<script lang="typescript">
    import { Error } from 'shared/components'
    import { getDecimalSeparator } from 'shared/lib/i18n'
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
    let decimalSeparator = getDecimalSeparator()

    const handleInput = (e) => {
        value = e.target.value
    }

    const onKeyPress = (e) => {
        if (e.key !== 'Tab') {
            const isEnter = e.key === 'Enter'
            if (isEnter && submitHandler) {
                submitHandler()
            }
            if ((float || integer) && !isEnter) {
                // if the input is float, we accept one dot or comma depending on localization
                if (float && e.key === decimalSeparator) {
                    if (value.indexOf(decimalSeparator) >= 0) {
                        e.preventDefault()
                    }
                } else if ('0123456789'.indexOf(e.key) < 0) {
                    // if float or interger we accept numbers
                    e.preventDefault()
                }
            }
        }
    }

    const onPaste = (e) => {
        if (e.clipboardData && (float || integer)) {
            const pasteVal = e.clipboardData.getData('text')
            // Discard scientific notation or negative
            if (pasteVal.indexOf('e') >= 0 || pasteVal.indexOf('-') >= 0) {
                e.preventDefault()
            } else if (float) {
                const val = Number.parseFloat(pasteVal)
                // Discard any number we can't parse as floats
                if (Number.isNaN(val)) {
                    e.preventDefault()
                }
            } else if (integer) {
                // Dicard anything with a decimal separator
                if (pasteVal.indexOf('.') >= 0 || pasteVal.indexOf(',') >= 0) {
                    e.preventDefault()
                } else {
                    const val = Number.parseInt(pasteVal, 10)
                    // Discard any number we can't parse as integers
                    if (Number.isNaN(val)) {
                        e.preventDefault()
                    }
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
        @apply pl-3;
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
            @apply pt-6;
            @apply pb-2;
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
            @apply left-3;
            @apply select-none;
            @apply whitespace-nowrap;
            @apply w-full;
            top: 8px;
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
            on:paste={onPaste}
            {disabled}
            {...$$restProps}
            {placeholder} />
        {#if label}
            <floating-label class:floating-active={value && label}>{label}</floating-label>
        {/if}
    </div>
    {#if error}
        <Error {error} />
    {/if}
</div>
