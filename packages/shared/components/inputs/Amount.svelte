<script>
    import { Unit } from '@iota/unit-converter'
    import { Text } from 'shared/components'
    export let amount = undefined
    export let unit = Unit.Mi
    export let label = undefined
    export let locale = undefined
    export let classes = ''
    export let maxClick = () => {}

    let dropdown = false

    function onKey(e) {
        if (e.keyCode === 8 || e.target.value.length <= 12) {
            return true
        } else {
            e.target.value = e.target.value.substring(0, 12)
        }
    }
    const clickOutside = () => {
        dropdown = false
    }
    const onSelect = (index) => {
        unit = index
    }
</script>

<style type="text/scss">
    amount-input {
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            @apply m-0;
            -webkit-appearance: none;
        }
        nav {
            &.active {
                @apply opacity-100;
                @apply pointer-events-auto;
            }
            button {
                &:hover,
                &.active {
                    @apply bg-gray-100;
                }
            }
        }
    }
</style>

<svelte:window on:click={clickOutside} />
<Text type="p" classes="mb-2" smaller>{label || locale('general.amount')}</Text>
<amount-input class="relative block {classes}">
    <input
        type="number"
        class="w-full py-4 pl-4 pr-24 text-gray-800 border border-solid border-gray-500 text-12 leading-140 font-700 rounded-lg"
        placeholder={label || locale('general.amount')}
        on:keydown={onKey}
        bind:value={amount} />
    <actions class="absolute right-0 top-0 h-full flex flex-row items-center text-12 text-gray-800 dark:text-white">
        <button on:click={maxClick} class="px-2 hover:text-blue-500">{locale('actions.max')}</button>
        <button
            on:click={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dropdown = !dropdown
            }}
            class="w-10 h-full text-center px-2 border-l border-solid border-gray-500">
            {unit}
            <nav
                class:active={dropdown}
                class="absolute w-10 overflow-y-auto bg-white border border-solid border-gray-500 pointer-events-none opacity-0 z-10 text-left top-12 right-0">
                {#each Object.values(Unit) as _unit}
                    <button class="text-center w-full py-2" on:click={() => onSelect(_unit)} class:active={unit === _unit}><Text
                            type="p"
                            smaller>
                            {_unit}
                        </Text></button>
                {/each}
            </nav>
        </button>
    </actions>
</amount-input>
