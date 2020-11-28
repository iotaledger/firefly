<script>
    import { Icon } from 'shared/components'
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
        input {
            transition: border-color 0.25s;
            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                @apply m-0;
            }
            &::placeholder {
                /* Chrome, Firefox, Opera, Safari 10.1+ */
                @apply text-gray-500;
            }
        }
        button {
            right: 12px; // TODO: unable to use tailwind inset
        }
        strength-meter {
            span {
                width: 22px;
                height: 4px;
                &:nth-child(1) {
                    @apply bg-orange-500;
                }
                &:nth-child(2) {
                    @apply bg-yellow-500;
                    background: #ffcf24;
                }
                &:nth-child(3) {
                    @apply bg-green-500;
                }
                &:nth-child(4) {
                    @apply bg-blue-500;
                    background: #108cff;
                }
                &.disabled {
                    @apply bg-gray-300;
                }
            }
        }
        :global(svg path) {
            @apply text-blue-500;
            @apply fill-current;
        }
        :global(svg path.stroke:not(.fixedstroke)) {
            fill: none;
            @apply stroke-current;
        }
    }
</style>

<password-input class={`relative block ${classes}`} class:with-toggle={showRevealToggle}>
    {#if showStrengthLevel}
        <strength-meter class="flex flex-row justify-end mb-2">
            {#each Array(strengthLevels) as _, i}
                <span class="ml-1 w-1.5 h-0.5 rounded-lg" class:disabled={i + 1 > strength} />
            {/each}
        </strength-meter>
    {/if}
    <div class="w-full relative flex items-center">
        <input
            {type}
            {value}
            on:input={handleInput}
            placeholder={placeholder || locale('general.password')}
            class:toggle={showRevealToggle}
            class="w-full relative text-12 leading-140 py-4 pr-8 pl-4
                 bg-white border border-solid border-gray-300 hover:border-gray-500 focus:border-gray-500 rounded-xl text-gray
                 " />
        {#if showRevealToggle === true}
            <button on:click={(e) => revealToggle(e)} tabindex="-1" class="absolute">
                <Icon icon={revealed ? 'view' : 'hide'} />
            </button>
        {/if}
    </div>
</password-input>
