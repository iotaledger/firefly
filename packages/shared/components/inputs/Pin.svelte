<script lang="typescript">
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { validatePinFormat, PIN_LENGTH } from 'shared/lib/utils'

    const dispatch = createEventDispatcher()

    export let value = undefined
    export let classes = ''

    let inputs = new Array(PIN_LENGTH)
    $: value = inputs.join('')

    const KEYBOARD = {
        BACKSPACE: 8,
        ENTER: 13,
    }

    onMount(async () => {
        document.getElementById('input-0').focus()
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
                    return
                }
                sibling = sibling.nextElementSibling
            }
        } else if (e.keyCode == KEYBOARD.ENTER) {
            if (validatePinFormat(inputs.join(''))) {
                dispatch('submit')
            }
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
                        return
                    }
                    sibling = nextInput
                }
            }
        }
    }

    const selectFirstEmpty = (e) => {
        let sibling = e.target.firstChild.firstChild
        for (let j = 0; j < PIN_LENGTH; j++) {
            if (!inputs[j] || j === PIN_LENGTH - 1) {
                sibling.focus()
                return
            }
            sibling = sibling.nextElementSibling
        }
    }
</script>

<style type="text/scss">
    pin-input {
        height: 80px;
        .input-wrapper {
            max-width: 204px;
            input {
                -webkit-text-security: disc;
                width: 14px;
                height: 14px;
                @apply bg-transparent;
                @apply text-transparent;
                @apply cursor-pointer;
                &:focus {
                    outline: none;
                }
            }
        }
        .input-decorator-wrapper {
            z-index: -1;
            max-width: 204px;
            input-decorator {
                width: 14px;
                height: 14px;
                @apply bg-gray-400;
                &.active {
                    @apply bg-blue-500;
                }
            }
        }
    }
</style>

<pin-input
    style="--pin-input-size: {PIN_LENGTH}"
    class={`flex items-center justify-center w-full relative z-0 bg-gray-50 rounded-xl ${classes}`}
    on:click={selectFirstEmpty}>
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
                    on:keydown|preventDefault={(event) => changeHandler(event, i)}
                    placeholder="" />
            {/each}
        </div>
        <div class="input-decorator-wrapper absolute w-full flex flex-row flex-no-wrap justify-between">
            {#each inputs as item, i}
                <input-decorator class="rounded-full" class:active={inputs[i] && inputs[i].length !== 0} />
            {/each}
        </div>
    {/if}
</pin-input>
