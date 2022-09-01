<script lang="typescript">
    import { onMount } from 'svelte'
    import { Error, Text } from 'shared/components'
    import { formatNumber, getAllDecimalSeparators, getDecimalSeparator, parseCurrency } from 'shared/lib/currency'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    export let value = ''
    export let classes = ''
    export let style = undefined
    export let label = undefined
    export let placeholder = undefined
    export let type = 'text'
    export let error: string
    export let maxlength = null
    export let float = false
    export let integer = false
    export let autofocus = false
    export let submitHandler = undefined
    export let disabled = false
    export let isFocused = false
    export let maxDecimals = undefined
    export let disableContextMenu = false
    export let capsLockWarning = false
    export let inputElement

    const allDecimalSeparators = getAllDecimalSeparators()
    const decimalSeparator = getDecimalSeparator()
    let capsLockOn = false
    let hasFocus = false

    const handleInput = (e) => {
        value = e.target.value
    }

    const onKeyCaps = (e) => {
        capsLockOn = e.getModifierState('CapsLock')
    }

    const onKeyPress = (e) => {
        if (e.key !== 'Tab') {
            const isEnter = e.key === 'Enter'
            if (isEnter && submitHandler) {
                submitHandler()
            }
            if ((float || integer) && !isEnter) {
                // if the input is float, we accept one dot or comma depending on localization
                if (float && allDecimalSeparators.find((sep) => sep === e.key)) {
                    if (allDecimalSeparators.some((sep) => value.indexOf(sep) >= 0)) {
                        return e.preventDefault()
                    }
                    value += decimalSeparator
                    e.preventDefault()
                } else if ('0123456789'.indexOf(e.key) < 0) {
                    // if float or interger we accept numbers
                    e.preventDefault()
                } else if (float && maxDecimals !== undefined && '0123456789'.indexOf(e.key) >= 0) {
                    // If max decimals are set only allow certain number after decimal separator
                    const sepPos = value.indexOf(decimalSeparator)
                    if (sepPos >= 0) {
                        // If caret position is after the separator then check
                        if (e.target.selectionEnd > sepPos) {
                            // If sel start and end are different that means
                            // the text has been highlighted for overwrite
                            // if they are the same then it single insertion
                            if (e.target.selectionStart === e.target.selectionEnd) {
                                const numDecimals = value.length - sepPos - 1
                                if (numDecimals >= maxDecimals) {
                                    e.preventDefault()
                                }
                            }
                        }
                    }
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
                const val = parseCurrency(pasteVal)
                // Discard any numbers we can't parse as floats
                if (Number.isNaN(val)) {
                    e.preventDefault()
                } else if (maxDecimals !== undefined) {
                    value = formatNumber(val, undefined, maxDecimals, 0)
                    e.preventDefault()
                }
            } else if (integer) {
                // Dicard anything with a decimal separator
                if (allDecimalSeparators.some((sep) => pasteVal.indexOf(sep) >= 0)) {
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

    const handleContextMenu = (e) => {
        if (disableContextMenu) {
            e.preventDefault()
        }
    }

    onMount(() => {
        if (autofocus) {
            inputElement.focus()
        }
    })
</script>

<div class="w-full {classes}">
    <div class="w-full relative">
        <input
            {type}
            {value}
            bind:this={inputElement}
            {maxlength}
            class="w-full text-12 leading-140 border border-solid
                {disabled
                ? 'text-gray-400 dark:text-gray-700'
                : 'text-gray-800 dark:text-white'} bg-white dark:bg-gray-800
                {isFocused
                ? 'border-blue-500'
                : error
                ? 'border-red-300 hover:border-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-gray-600'}"
            class:floating-active={value && label}
            on:input={handleInput}
            on:keypress={onKeyPress}
            on:keydown={onKeyCaps}
            on:keyup={onKeyCaps}
            on:paste={onPaste}
            on:contextmenu={handleContextMenu}
            on:focus={() => (hasFocus = true)}
            on:blur={() => (hasFocus = false)}
            {disabled}
            {...$$restProps}
            {placeholder}
            {style}
            spellcheck={false}
        />
        {#if label}
            <floating-label class:floating-active={value && label}>{label}</floating-label>
        {/if}
    </div>
    {#if capsLockWarning && hasFocus && capsLockOn}
        <Text smaller overrideColor classes="mt-1 text-orange-500">{locale('general.capsLock')}</Text>
    {/if}
    {#if error}
        <Error {error} />
    {/if}
</div>

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
        font-feature-settings: 'calt' off; // disables 'x' formatting while surrounded by numbers

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
            @apply transition-none;
            top: 8px;
        }
        &:not(:disabled) {
            + floating-label {
                &.floating-active {
                    @apply transition-all;
                    @apply ease-out;
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
