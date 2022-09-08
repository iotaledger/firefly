<script lang="typescript">
    import { onMount, createEventDispatcher, tick } from 'svelte'
    import { Text, InputContainer } from 'shared/components'
    import { formatNumber, getAllDecimalSeparators, getDecimalSeparator, parseCurrency } from '@lib/currency'
    import { localize } from '@core/i18n'
    import { TextType } from 'shared/components/Text.svelte'
    import type { TextPropTypes } from 'shared/components/Text.svelte'

    export let value: string = ''
    export let classes: string = ''
    export let containerClasses: string = ''
    export let style: string
    export let label: string
    export let placeholder: string
    export let type = 'text'
    export let error: string
    export let maxlength: number
    export let float = false
    export let integer = false
    export let autofocus = false
    export let submitHandler = (): void => {}
    export let disabled = false
    export let maxDecimals: number
    export let disableContextMenu = false
    export let capsLockWarning = false
    export let inputElement: HTMLInputElement
    export let clearBackground = false
    export let clearPadding = false
    export let clearBorder = false
    export let alignment: 'left' | 'right' | 'center' | 'justify' = 'left'
    export let textProps: TextPropTypes = { type: TextType.p, fontSize: '11', lineHeight: '140' }
    export let hasFocus = false

    const dispatch = createEventDispatcher()
    const allDecimalSeparators = getAllDecimalSeparators()
    const decimalSeparator = getDecimalSeparator()

    let capsLockOn = false

    function handleInput(event: InputEvent): void {
        value = (event.target as HTMLInputElement).value
    }

    function onKeyCaps(event: KeyboardEvent): void {
        capsLockOn = event.getModifierState('CapsLock')
    }

    function onKeyPress(event: KeyboardEvent): void {
        if (event.key !== 'Tab') {
            const isEnter = event.key === 'Enter'
            if (isEnter && submitHandler) {
                submitHandler()
            }
            if ((float || integer) && !isEnter) {
                // if the input is float, we accept one dot or comma depending on localization
                if (float && event.key === decimalSeparator) {
                    if (value?.indexOf(decimalSeparator) >= 0) {
                        event.preventDefault()
                    }
                } else if ('0123456789'?.indexOf(event.key) < 0) {
                    // if float or interger we accept numbers
                    event.preventDefault()
                } else if (float && maxDecimals !== undefined && '0123456789'?.indexOf(event.key) >= 0) {
                    // If max decimals are set only allow certain number after decimal separator
                    const sepPos = value?.indexOf(decimalSeparator)
                    if (sepPos >= 0) {
                        // If caret position is after the separator then check
                        if ((event.target as HTMLInputElement).selectionEnd > sepPos) {
                            // If sel start and end are different that means
                            // the text has been highlighted for overwrite
                            // if they are the same then it single insertion
                            if (
                                (event.target as HTMLInputElement).selectionStart ===
                                (event.target as HTMLInputElement).selectionEnd
                            ) {
                                const numDecimals = value.length - sepPos - 1
                                if (numDecimals >= maxDecimals) {
                                    event.preventDefault()
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function onPaste(event: ClipboardEvent): void {
        if (event.clipboardData && (float || integer)) {
            const pasteVal = event.clipboardData.getData('text')
            // Discard scientific notation or negative
            if (pasteVal?.indexOf('e') >= 0 || pasteVal?.indexOf('-') >= 0) {
                event.preventDefault()
            } else if (float) {
                const val = parseCurrency(pasteVal)
                // Discard any numbers we can't parse as floats
                if (Number.isNaN(val)) {
                    event.preventDefault()
                } else if (maxDecimals !== undefined) {
                    value = formatNumber(val, undefined, maxDecimals, 0)
                    event.preventDefault()
                }
            } else if (integer) {
                // Dicard anything with a decimal separator
                if (allDecimalSeparators.some((sep) => pasteVal?.indexOf(sep) >= 0)) {
                    event.preventDefault()
                } else {
                    const val = Number.parseInt(pasteVal, 10)
                    // Discard any number we can't parse as integers
                    if (Number.isNaN(val)) {
                        event.preventDefault()
                    }
                }
            }
        }
    }

    function handleContextMenu(event: UIEvent): void {
        if (disableContextMenu) {
            event.preventDefault()
        }
    }

    onMount(async () => {
        if (autofocus) {
            await tick()
            inputElement.focus()
        }
    })
</script>

<div class="w-full {classes}">
    <div class="w-full relative">
        <InputContainer
            bind:inputElement
            {disabled}
            {error}
            isFocused={hasFocus}
            {clearBackground}
            {clearPadding}
            {clearBorder}
            classes="relative {containerClasses}"
        >
            <Text {...textProps} classes="flex w-full">
                <input
                    {type}
                    {value}
                    bind:this={inputElement}
                    {maxlength}
                    class="w-full text-{alignment}
                        bg-white dark:bg-gray-800
                        {disabled ? 'text-gray-400 dark:text-gray-700' : 'text-gray-800 dark:text-white'}"
                    class:floating-active={value && label}
                    on:input={handleInput}
                    on:keypress={onKeyPress}
                    on:keydown={onKeyCaps}
                    on:keyup={onKeyCaps}
                    on:paste={onPaste}
                    on:contextmenu={handleContextMenu}
                    on:focus={() => (hasFocus = true)}
                    on:blur={() => (hasFocus = false)}
                    on:change={() => dispatch('change')}
                    {disabled}
                    {placeholder}
                    {style}
                    spellcheck={false}
                    {...$$restProps}
                />
            </Text>
            {#if label}
                <floating-label {disabled} class:hasFocus class:floating-active={value && label}>{label}</floating-label
                >
            {/if}
        </InputContainer>
    </div>
    {#if capsLockWarning && hasFocus && capsLockOn}
        <Text smaller overrideColor classes="mt-1 text-orange-500">{localize('general.capsLock')}</Text>
    {/if}
</div>

<style type="text/scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        @apply m-0;
    }
    input {
        font-feature-settings: 'calt' off; // disables 'x' formatting while surrounded by numbers

        &::placeholder {
            @apply text-gray-500;
        }

        &.floating-active {
            @apply pt-2;
            @apply -mb-2;
        }
    }

    floating-label {
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
        @apply w-auto;
        @apply transition-none;
        @apply text-left;
        top: 8px;

        &.hasFocus {
            @apply text-blue-500;
        }
        &:not(:disabled) {
            &.floating-active {
                @apply transition-all;
                @apply ease-out;
                @apply opacity-100;
                transform: none;
            }
        }

        &:disabled {
            &.floating-active {
                @apply pointer-events-none;
                @apply opacity-50;
            }
        }
    }
</style>
