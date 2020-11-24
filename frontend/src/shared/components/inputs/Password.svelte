<script>
    import { Icon } from '@shared-components'
    export let value = ''
    export let classes = ''
    export let strength = 0
    export let showStrengthLevel = false
    export let showRevealToggle = false
    export let strengthLevels = 4
    export let placeholder = undefined
    export let locale = undefined

    let revealed = false
    let type = 'password'

    const handleInput = (event) => {
        value = event.target.value
    }

    const revealToggle = (event) => {
        const input = event.currentTarget.previousElementSibling

        if (!input) {
            return
        }

        input.type = input.type === 'password' ? 'text' : 'password'
        revealed = !revealed
    }
</script>

<style type="text/scss">
    password-input {
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input {
            padding: 15px 40px 16px 13px;
            color: var(--text-secondary-color);
            background: var(--element-bg-color);
            border-color: var(--line-separator-color);
            border-radius: 10px;
            box-shadow: -2px -2px 4px rgba(255, 255, 255, 0.2), 0px 4px 8px rgba(65, 114, 248, 0.08);
        }
        :global(svg path) {
            fill: var(--ui-blue-color);
        }
        :global(svg path.stroke:not(.fixedstroke)) {
            fill: none;
            stroke: var(--ui-blue-color);
        }
        button {
            position: absolute;
            right: 12px;
            transform: translateY(-50%);
            top: 50%;
        }
        strength-meter {
            span {
                width: 22px;
                height: 4px;
                border-radius: 10px;
                &:nth-child(1) {
                    background: #fe968a;
                }
                &:nth-child(2) {
                    background: #ffcf24;
                }
                &:nth-child(3) {
                    background: #00e0ca;
                }
                &:nth-child(4) {
                    background: #108cff;
                }
                &.disabled {
                    background: var(--text-disabled-color);
                }
            }
        }
    }
</style>

<password-input class={`relative block ${classes}`} class:with-toggle={showRevealToggle}>
    {#if showStrengthLevel}
        <strength-meter class="flex flex-row justify-end mb-2">
            {#each Array(strengthLevels) as _, i}<span class:disabled={i + 1 > strength} class="ml-1" />{/each}
        </strength-meter>
    {/if}
    <div class="w-full relative">
        <input
            {type}
            {value}
            on:input={handleInput}
            placeholder={placeholder || locale('general.password')}
            class:toggle={showRevealToggle}
            class="w-full relative border border-solid text-12 leading-140 font-bold" />
        {#if showRevealToggle === true}
            <button on:click={(e) => revealToggle(e)} tabindex="-1">
                <Icon icon={revealed ? 'view' : 'hide'} />
            </button>
        {/if}
    </div>
</password-input>
