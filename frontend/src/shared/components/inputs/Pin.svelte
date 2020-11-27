<script>
    import { onMount } from 'svelte'

    export let value = undefined
    export let size = 6
    export let classes = ''

    let inputs = new Array(size)
    $: value = parseInt(inputs.join(''), 10)

    const KEYBOARD = {
        BACKSPACE: 8,
    }

    onMount(async () => {
        document.getElementById('input-0').focus()
    })

    const changeHandler = function (e, i) {
        let nextInput = e.target.nextElementSibling
        let prevInput = e.target.previousElementSibling
        let regex = new RegExp(/^\d+$/)

        if (e.keyCode == KEYBOARD.BACKSPACE) {
            inputs[i] = ''
            if (prevInput) {
                prevInput.focus()
            }
        } else {
            if (!nextInput && inputs[i] && inputs[i] !== '') {
                return
            }
            if (regex.test(e.key)) {
                inputs[i] = e.key
                if (nextInput) {
                    nextInput.focus()
                }
            }
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
    style="--pin-input-size: {size}"
    class={`flex items-center justify-center w-full relative z-0 bg-gray-50 rounded-xl	${classes}`}>
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
