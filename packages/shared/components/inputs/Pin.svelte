<script lang="typescript">
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { validatePinFormat, PIN_LENGTH } from 'shared/lib/utils'
    import { Icon } from 'shared/components'

    const dispatch = createEventDispatcher()

    export let value = undefined
    export let classes = ''
    export let disabled = false
    export let autofocus = false
    export let glimpse = false

    let inputs = new Array(PIN_LENGTH)
    $: value = inputs.join('')

    let root
    let inputElements = []

    const KEYBOARD = {
        BACKSPACE: 8,
        ENTER: 13,
        TAB: 9,
    }

    onMount(async () => {
        if (autofocus) {
            focus()
        }
    })

    const handleBackspace = () => {
        // Search for the last child with a value
        // and remove it
        let sibling = inputElements[0]
        for (let j = 0; j <= PIN_LENGTH; j++) {
            if (j === PIN_LENGTH || !inputs[j]) {
                inputs[j - 1] = ''
                if (sibling.previousElementSibling) {
                    sibling.previousElementSibling.focus()
                }
                break
            }
            sibling = sibling.nextElementSibling
        }
    }

    const changeHandler = function (e, i) {
        let regex = new RegExp(/^\d+$/)

        if (e.keyCode == KEYBOARD.BACKSPACE) {
            handleBackspace()
        } else if (e.keyCode == KEYBOARD.ENTER) {
            if (validatePinFormat(inputs.join(''))) {
                dispatch('submit')
            }
        } else if (e.keyCode == KEYBOARD.TAB) {
            // Do default tab handling by focusing the root
            // container and allow default processing to happen
            root.focus()
            return
        } else {
            if (regex.test(e.key)) {
                // Search from the first child to find the first
                // empty value and start filling from there
                let sibling = inputElements[0]
                for (let j = 0; j < PIN_LENGTH; j++) {
                    let nextInput = sibling.nextElementSibling
                    if (!inputs[j]) {
                        inputs[j] = e.key
                        if (nextInput) {
                            nextInput.focus()
                        }
                        break
                    }
                    sibling = nextInput
                }
            }
        }
        e.preventDefault()
    }

    const selectFirstEmpty = () => {
        let sibling = inputElements[0]
        for (let j = 0; j < PIN_LENGTH; j++) {
            if (!inputs[j] || j === PIN_LENGTH - 1) {
                sibling.focus()
                return
            }
            sibling = sibling.nextElementSibling
        }
    }

    const selectFirstEmptyRoot = (e) => {
        if (e.target === root) {
            selectFirstEmpty()
        }
    }

    export function focus() {
        if (!disabled) {
            selectFirstEmpty()
        }
    }

    export function resetAndFocus() {
        if (!disabled) {
            inputs = new Array(PIN_LENGTH)
            selectFirstEmpty()
        } else {
            setTimeout(() => resetAndFocus(), 100)
        }
    }
</script>

<style type="text/scss">
    pin-input {
        @apply cursor-pointer;
        @apply select-none;
        @apply h-20;
        padding-left: 50px;
        padding-right: 32px;

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
                transition: opacity 1s;
                &.active {
                    @apply opacity-100;
                }
            }
        }
    }
</style>

<pin-input
    style="--pin-input-size: {PIN_LENGTH}"
    class={`flex items-center justify-between w-full relative z-0 rounded-xl border border-solid
            bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700
            ${classes}`}
    class:disabled
    bind:this={root}
    on:click={selectFirstEmptyRoot}
    on:focus={selectFirstEmptyRoot}
    tabindex="0">
    <div class="flex flex-row inputs-wrapper">
        <div class="input-wrapper absolute items-center w-full flex flex-row flex-no-wrap justify-between">
            {#each inputs as item, i}
                <input
                    bind:value={inputs[i]}
                    maxLength="1"
                    id={`input-${i}`}
                    type="text"
                    pattern="\d{1}"
                    bind:this={inputElements[i]}
                    class:active={!inputs[i] || inputs[i].length === 0}
                    class:glimpse
                    {disabled}
                    on:keydown={(event) => changeHandler(event, i)}
                    on:contextmenu|preventDefault
                    placeholder="" />
            {/each}
        </div>
        <div class="input-decorator-wrapper items-center absolute w-full flex flex-row flex-no-wrap justify-between">
            {#each inputs as item, i}
                <input-decorator class:active={inputs[i] && inputs[i].length !== 0} class:disabled />
            {/each}
        </div>
    </div>
    <button type="button" on:click={handleBackspace} {disabled}>
        <Icon icon="backspace" classes="text-gray-500" />
    </button>
</pin-input>
