<script lang="ts">
    import { Error, Icon, Text } from 'shared/components'
    import { createEventDispatcher, onMount } from 'svelte'
    import { mobile, PlatformOption, platform } from '@core/app'
    import { isValidPin, PIN_LENGTH } from '@core/utils'

    const dispatch = createEventDispatcher()

    export let value: string
    export let error: string = ''
    export let label: string = ''
    export let classes = ''
    export let disabled = false
    export let autofocus = false
    export let glimpse = false
    export let smaller = false

    let inputs = new Array(PIN_LENGTH)

    $: {
        if (!value) {
            inputs = new Array(PIN_LENGTH)
        }
    }
    $: value.length === PIN_LENGTH && dispatch('filled')
    $: isAndroid = $platform === PlatformOption.Android

    let root: HTMLElement
    const inputElements: HTMLElement[] = []

    enum KEYBOARD {
        BACKSPACE = 'Backspace',
        ENTER = 'Enter',
        TAB = 'Tab',
    }

    export function focus(): void {
        if (!disabled) {
            selectFirstEmpty()
        }
    }

    export function resetAndFocus(): void {
        if (!disabled) {
            inputs = new Array(PIN_LENGTH)
            selectFirstEmpty()
        } else {
            setTimeout(resetAndFocus, 100)
        }
    }

    function selectFirstEmpty(): void {
        for (let j = 0; j < PIN_LENGTH; j++) {
            if (!inputs[j] || j === PIN_LENGTH - 1) {
                inputElements[j].focus()
                return
            }
        }
    }

    function selectFirstEmptyRoot(event: FocusEvent | MouseEvent): void {
        if (event.target === root && !inputElements.some((input) => input === event.relatedTarget)) {
            selectFirstEmpty()
        }
    }

    function handleBackspace(): void {
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

    function changeHandler(event: KeyboardEvent): void {
        const regex = new RegExp(/^\d+$/)
        if (event.key === KEYBOARD.BACKSPACE) {
            handleBackspace()
        } else if (event.key === KEYBOARD.ENTER) {
            if (isValidPin(inputs.join(''))) {
                dispatch('submit')
            }
        } else if (event.key === KEYBOARD.TAB) {
            // Do default tab handling by focusing the root
            // container and allow default processing to happen
            root.focus()
            return
        } else {
            if (regex.test(event.key)) {
                // Search from the first child to find the first
                // empty value and start filling from there
                for (let j = 0; j < PIN_LENGTH; j++) {
                    if (!inputs[j]) {
                        inputs[j] = event.key
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
    function changeHandlerHelper(event: InputEventInit, index: number): void {
        if (!/^[0-9]$/.test(event.data)) {
            inputs[index] = ''
        } else {
            inputElements[index + 1].focus()
        }
    }

    onMount(() => {
        if (autofocus) {
            focus()
        }
    })
</script>

<div class="w-full {classes}">
    {#if label}
        <Text type="p" secondary classes="mb-1">{label}</Text>
    {/if}
    <pin-input
        style="--pin-input-size: {PIN_LENGTH}"
        class={`flex items-center justify-between w-full relative z-0 rounded-xl border border-solid
            bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700
            ${smaller ? 'h-14 pl-6 pr-4' : 'h-20 pl-12 pr-8'}`}
        class:disabled
        bind:this={root}
        on:click={selectFirstEmptyRoot}
        on:focus={selectFirstEmptyRoot}
        tabindex="0"
    >
        <div class="flex flex-row inputs-wrapper">
            <div class="input-wrapper absolute items-center w-full flex flex-row flex-no-wrap justify-between">
                {#each inputs as input, i}
                    {#if $mobile}
                        <input
                            bind:value={input}
                            maxLength="1"
                            id={`input-${i}`}
                            type="tel"
                            bind:this={inputElements[i]}
                            class:active={!input || input.length === 0}
                            class:glimpse
                            {disabled}
                            on:input={(event) => (isAndroid ? changeHandlerHelper(event, i) : undefined)}
                            on:keydown={changeHandler}
                            on:contextmenu|preventDefault
                        />
                    {:else}
                        <input
                            bind:value={input}
                            maxLength="1"
                            id={`input-${i}`}
                            type="text"
                            bind:this={inputElements[i]}
                            class:active={!input || input.length === 0}
                            class:glimpse
                            {disabled}
                            on:keydown={changeHandler}
                            on:contextmenu|preventDefault
                            tabindex="-1"
                        />
                    {/if}
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
        <button type="button" on:click={handleBackspace} {disabled} tabindex="-1">
            <Icon icon="backspace" classes={smaller ? 'text-blue-500' : 'text-gray-500'} />
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
