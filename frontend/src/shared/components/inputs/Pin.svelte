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
        display: block;
        width: 100%;
        max-width: 204px;
        height: 14px;
        position: relative;
        z-index: 0;
        .input-wrapper {
            position: relative;
            margin: 0 auto;
            align-items: center;
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            max-width: 204px;
            input {
                -webkit-text-security: disc;
                // border: none;
                width: 14px;
                height: 14px;
                background: transparent;
                color: transparent;
                cursor: pointer;
                &:focus {
                    outline: none;
                }
            }
        }
        .input-decorator-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            z-index: -1;
            input-decorator {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #c8d4e9;
                &.active {
                    background: #108cff;
                }
            }
        }
    }
</style>

<pin-input style="--pin-input-size: {size}" class={classes}>
    {#if inputs.length}
        <div class="input-wrapper">
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
        <div class="input-decorator-wrapper">
            {#each inputs as item, i}
                <input-decorator class:active={inputs[i] && inputs[i].length !== 0} />
            {/each}
        </div>
    {/if}
</pin-input>
