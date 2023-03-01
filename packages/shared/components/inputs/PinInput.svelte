<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'

    import { Error, Icon, Text, TextType } from 'shared/components'

    import { isValidPin, PIN_LENGTH } from '@core/utils'

    import { Icon as IconEnum } from '@auxiliary/icon'

    const dispatch = createEventDispatcher()

    export let value: string
    export let error: string = ''
    export let label: string = ''
    export let classes: string = ''
    export let disabled = false
    export let autofocus = false
    export let glimpse = false
    export let smaller = false

    let inputs = new Array(PIN_LENGTH)
    let root: HTMLElement

    const inputElements: HTMLInputElement[] = []

    enum KEYBOARD {
        BACKSPACE = 'Backspace',
        BACKWARD = 'deleteContentBackward',
        ENTER = 'Enter',
        TAB = 'Tab',
    }

    $: {
        if (!value) {
            inputs = new Array(PIN_LENGTH)
        }
    }
    $: value.length === PIN_LENGTH && dispatch('filled')

    onMount(() => {
        if (autofocus) {
            focus()
        }
    })
    export function focus(): void {
        if (!disabled) {
            onSelectFirstEmpty()
        }
    }

    export function resetAndFocus(): void {
        if (!disabled) {
            inputs = new Array(PIN_LENGTH)
            onSelectFirstEmpty()
        } else {
            setTimeout(resetAndFocus, 100)
        }
    }

    function removeLatestInput(): void {
        // Search for the last child with a value
        // and remove it
        for (let j = 1; j <= PIN_LENGTH; j++) {
            if (j === PIN_LENGTH || !inputs[j]) {
                inputs[j - 1] = ''
                inputElements[j - 1].focus()
                break
            }
        }
        value = inputs.join('')
    }

    /**
     * On Android we need both on:keydown and on:input.
     * Keydown only handles 'Backspace' since some soft-keyboards
     * doesn't send the inputType value as 'deleteContentBackward'.
     * Input event handle the rest, as input also could be dictated, drawed, etc.
     */
    function onChangeWithKeydown(event: KeyboardEvent): void {
        const { key } = event
        const regex = new RegExp(/^\d+$/)
        if (key === KEYBOARD.BACKSPACE || key === KEYBOARD.BACKWARD) {
            removeLatestInput()
        } else if (key === KEYBOARD.ENTER) {
            if (isValidPin(inputs.join(''))) {
                dispatch('submit')
            }
        } else if (key === KEYBOARD.TAB) {
            // Do default tab handling by focusing the root
            // container and allow default processing to happen
            root.focus()
            return
        } else {
            if (regex.test(key)) {
                // Search from the first child to find the first
                // empty value and start filling from there
                for (let j = 0; j < PIN_LENGTH; j++) {
                    if (!inputs[j]) {
                        inputs[j] = key
                        if (j < PIN_LENGTH - 1) {
                            inputElements[j + 1].focus()
                        }
                        break
                    }
                }
                value = inputs.join('')
            }
        }
        event.preventDefault()
    }

    /**
     * for android mobile we need both onkeydown and oninput
     * event listeners to the input and handle the old and the new value.
     * the auto-suggest feature or other event might follow
     * the keydown event and invalidate it.
     */
    function onChangeWithInput(event: InputEventInit, index: number): void {
        if (!/^[0-9]$/.test(event.data)) {
            inputs[index] = ''
        } else {
            inputElements[index + 1].focus()
        }
    }

    function onSelectFirstEmpty(): void {
        for (let j = 0; j < PIN_LENGTH; j++) {
            if (!inputs[j] || j === PIN_LENGTH - 1) {
                inputElements[j].focus()
                return
            }
        }
    }
</script>

<div class="w-full {classes}">
    {#if label}
        <Text type={TextType.p} secondary classes="mb-1">{label}</Text>
    {/if}
    <pin-input
        style="--pin-input-size: {PIN_LENGTH}"
        class={`flex items-center justify-between relative z-0 rounded-xl border border-solid
            bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700
            ${smaller ? 'h-14 pl-6 pr-4' : 'h-20 pl-12 pr-8'}`}
        class:disabled
        bind:this={root}
        on:click={onSelectFirstEmpty}
        on:keypress={onSelectFirstEmpty}
        on:focus={onSelectFirstEmpty}
    >
        <div class="flex flex-row inputs-wrapper">
            <div class="input-wrapper absolute items-center w-full flex flex-row flex-no-wrap justify-between">
                {#each inputs as input, i}
                    <input
                        bind:value={input}
                        maxLength="1"
                        id={`input-${i}`}
                        type="password"
                        inputmode="numeric"
                        autocomplete="off"
                        bind:this={inputElements[i]}
                        class:active={!input || input.length === 0}
                        class:glimpse
                        {disabled}
                        on:input={(event) => onChangeWithInput(event, i)}
                        on:keydown={onChangeWithKeydown}
                        on:contextmenu|preventDefault
                    />
                {/each}
            </div>
            <div
                class="input-decorator-wrapper items-center absolute w-full flex flex-row flex-no-wrap justify-between"
            >
                {#each inputs as input}
                    <input-decorator class:active={input && input.length !== 0} class:disabled />
                {/each}
            </div>
        </div>
        <button type="button" on:click={removeLatestInput} {disabled} tabindex="-1">
            <Icon icon={IconEnum.Backspace} classes={smaller ? 'text-blue-500' : 'text-gray-500'} />
        </button>
    </pin-input>
    {#if error}
        <Error {error} />
    {/if}
</div>

<style type="text/scss">
    pin-input {
        @apply cursor-pointer;
        @apply select-none;

        &:not(.disabled):focus-within,
        &:not(.disabled):hover {
            @apply border-gray-500;
        }
        &.disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
        .inputs-wrapper {
            height: 27px;
        }
        .input-wrapper {
            max-width: 204px;
            height: 27px;

            input {
                -webkit-text-security: none;
                @apply w-4;
                @apply bg-transparent;
                @apply opacity-0;
                @apply text-transparent;
                @apply cursor-pointer;
                @apply text-center;
                @apply text-18;
                @apply rounded-none;
                caret-color: transparent;
                transition: opacity 1s, color 1s;

                &.active {
                    border-bottom-width: 1px;
                    border-bottom-style: solid;
                    @apply border-blue-500;
                    @apply cursor-text;
                    @apply opacity-100;

                    &.glimpse {
                        @apply text-blue-500;
                    }
                }

                &:focus {
                    @apply outline-none;
                }
            }
        }
        .input-decorator-wrapper {
            z-index: -1;
            max-width: 204px;
            height: 27px;
            input-decorator {
                @apply w-4;
                @apply h-4;
                @apply rounded-full;
                @apply bg-blue-500;
                @apply opacity-0;
                &.active {
                    transition: opacity 1s;
                    @apply opacity-100;
                }
            }
        }
    }
</style>
