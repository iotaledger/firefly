<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'

    import { Error, Icon, Text, TextType } from '@ui'

    import { Icon as IconType } from '@auxiliary/icon'
    import { PIN_LENGTH } from '@core/utils'

    const inputElements: HTMLInputElement[] = []
    const dispatch = createEventDispatcher()

    export let value = ''
    export let error = ''
    export let label = ''
    export let classes = ''
    export let disabled = false
    export let autofocus = false
    export let glimpse = false
    export let smaller = false

    let inputs = new Array(PIN_LENGTH)

    $: if (!value) {
        inputs = new Array(PIN_LENGTH)
    }
    $: if (value.length === PIN_LENGTH) {
        dispatch('filled')
    }

    onMount(() => {
        if (autofocus) {
            focus()
        }
    })

    function onBackspace() {
        // Search for the last child with a value and remove it
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
    function onChangeHandler(event: Event & InputEventInit, i: number): void {
        if (!event.isTrusted || !/^[0-9]$/.test(event.data)) {
            inputs[i] = ''
            inputElements[i].focus()
            return
        }
        if (event.inputType === 'deleteContentBackward') {
            onBackspace()
        } else if (event.inputType === 'insertText') {
            inputElements[i + 1]?.focus()
            value = inputs.join('')
        }
    }

    function onBackspaceHelper(event: KeyboardEvent): void {
        if (event.key === 'Backspace') {
            onBackspace()
        }
    }

    function onFocus(i: number): void {
        if (inputElements[i - 1]?.value === '') {
            inputs[i] = ''
            inputElements[i - 1].focus()
        }
    }

    function onSelectFirstEmpty() {
        for (let j = 0; j < PIN_LENGTH; j++) {
            if (!inputs[j] || j === PIN_LENGTH - 1) {
                inputElements[j].focus()
                return
            }
        }
    }

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
            setTimeout(() => resetAndFocus(), 100)
        }
    }
</script>

<div class="w-full {classes}">
    {#if label}
        <Text type={TextType.p} secondary classes="mb-1">{label}</Text>
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <pin-input
        style="--pin-input-size: {PIN_LENGTH}"
        class="{smaller ? 'h-16' : 'h-20'} w-full
                flex items-center justify-between relative z-0 rounded-xl border border-solid
                bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700
                {smaller ? 'h-14 pl-6 pr-4' : 'pl-10 pr-10'}"
        class:disabled
        on:click={onSelectFirstEmpty}
        on:focus={onSelectFirstEmpty}
        tabindex="0"
    >
        <div class="flex flex-row inputs-wrapper">
            <div class="input-wrapper absolute items-center w-full flex flex-row flex-no-wrap justify-between">
                {#each inputs as _item, i}
                    <input
                        bind:value={inputs[i]}
                        maxLength="1"
                        id={`input-${i}`}
                        type="password"
                        inputmode="numeric"
                        autocomplete="off"
                        bind:this={inputElements[i]}
                        class:active={!inputs[i] || inputs[i].length === 0}
                        class:glimpse
                        {disabled}
                        on:input={(event) => onChangeHandler(event, i)}
                        on:keydown={onBackspaceHelper}
                        on:focus={() => onFocus(i)}
                        on:contextmenu|preventDefault
                    />
                {/each}
            </div>
            <div
                class="input-decorator-wrapper items-center absolute w-full flex flex-row flex-no-wrap justify-between"
            >
                {#each inputs as _item, i}
                    <input-decorator class:active={inputs[i] && inputs[i].length !== 0} class:disabled />
                {/each}
            </div>
        </div>
        <button type="button" on:click={onBackspace} {disabled} tabindex="-1">
            <Icon icon={IconType.Backspace} classes={smaller ? 'text-blue-500' : 'text-gray-500'} />
        </button>
    </pin-input>
    {#if error}
        <Error {error} />
    {/if}
</div>

<style lang="scss">
    pin-input {
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
