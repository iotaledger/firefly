<script lang="typescript">
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { validatePinFormat, PIN_LENGTH } from 'shared/lib/utils'

    const dispatch = createEventDispatcher()

    export let value = undefined
    export let classes = ''
    export let disabled = false
    export let autofocus = false

    let inputs = new Array(PIN_LENGTH)
    $: value = inputs.join('')

    let root

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

    const changeHandler = function (e, i) {
        let regex = new RegExp(/^\d+$/)

        if (e.keyCode == KEYBOARD.BACKSPACE) {
            // Search for the last child with a value
            // and remove it
            let sibling = e.target.parentNode.firstChild
            for (let j = 0; j <= PIN_LENGTH; j++) {
                if (j === PIN_LENGTH || !inputs[j]) {
                    inputs[j - 1] = ''
                    if (sibling) {
                        sibling.focus()
                    }
                    break
                }
                sibling = sibling.nextElementSibling
            }
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
                let sibling = e.target.parentNode.firstChild
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
        let sibling = root.firstChild.firstChild
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

        &:not(.disabled):focus-within,
        &:not(.disabled):hover {
            @apply border-gray-500;
        }

        &.disabled {
            @apply cursor-default;
        }
        .input-wrapper {
            max-width: 204px;
            input {
                -webkit-text-security: none;
                @apply w-3.5;
                @apply h-3.5;
                @apply opacity-0;
                @apply bg-transparent;
                @apply text-transparent;
                @apply cursor-pointer;
                &:focus {
                    @apply outline-none;
                }
                &:disabled {
                    @apply cursor-default;
                }
            }
        }
        .input-decorator-wrapper {
            z-index: -1;
            max-width: 204px;
            input-decorator {
                @apply w-3.5;
                @apply h-3.5;
                @apply bg-gray-400;
                &.active {
                    @apply bg-blue-500;
                }
                &.disabled {
                    @apply bg-gray-400;
                }
            }
        }
    }
</style>

<pin-input
    style="--pin-input-size: {PIN_LENGTH}"
    class={`flex items-center justify-center w-full relative z-0 rounded-xl border border-solid
            bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700
            ${classes}`}
    class:disabled
    bind:this={root}
    on:click={selectFirstEmptyRoot}
    on:focus={selectFirstEmptyRoot}
    tabindex="0">
    {#if inputs.length}
        <div class="input-wrapper absolute items-center w-full flex flex-row flex-no-wrap justify-between">
            {#each inputs as item, i}
                <input
                    bind:value={inputs[i]}
                    maxLength="1"
                    id={`input-${i}`}
                    type="password"
                    pattern="\d{1}"
                    maxlength="1"
                    {disabled}
                    on:keydown={(event) => changeHandler(event, i)}
                    on:contextmenu|preventDefault
                    placeholder="" />
            {/each}
        </div>
        <div class="input-decorator-wrapper absolute w-full flex flex-row flex-no-wrap justify-between">
            {#each inputs as item, i}
                <input-decorator class="rounded-full" class:active={inputs[i] && inputs[i].length !== 0} class:disabled />
            {/each}
        </div>
    {/if}
</pin-input>
