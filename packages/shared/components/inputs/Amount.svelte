<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Input, Text } from 'shared/components'

    export let amount = undefined
    export let unit = Unit.Mi
    export let label = undefined
    export let locale = undefined
    export let classes = ''
    export let maxClick = () => {}
    export let error = ''
    export let disabled = false

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
        nav {
            &.active {
                @apply opacity-100;
                @apply pointer-events-auto;
            }
        }
    }
    amount-input {
        &.disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
    }
</style>

<svelte:window on:click={clickOutside} />
<Text type="p" classes="mb-2 {disabled && 'opacity-50'}" smaller>{label || locale('general.amount')}</Text>
<amount-input class:disabled class="relative block {classes}">
    <Input
        {error}
        type="number"
        placeholder={label || locale('general.amount')}
        on:keydown={onKey}
        bind:value={amount}
        {disabled} />
    <actions class="absolute right-0 top-2.5 h-8 flex flex-row items-center text-12 text-gray-500 dark:text-white">
        <button on:click={maxClick} class="pr-3 hover:text-blue-500" {disabled}>{locale('actions.max').toUpperCase()}</button>
        <button
            on:click={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dropdown = !dropdown
            }}
            class={`w-10 h-full text-center px-2 border-l border-solid border-gray-500`}
            {disabled}>
            {unit}
            <nav
                class:active={dropdown && !disabled}
                class="absolute w-10 overflow-hidden pointer-events-none opacity-0 z-10 text-left top-10 right-0 rounded-lg
                    bg-gray-50 dark:bg-gray-800
                    border border-solid border-gray-300 hover:border-gray-500 dark:border-gray-700 dark:hover:border-gray-700">
                {#each Object.values(Unit) as _unit}
                    <button
                        class="text-center w-full py-2 {unit === _unit && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'} 
                            hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                        on:click={() => onSelect(_unit)}
                        class:active={unit === _unit}>
                        <Text type="p" smaller>{_unit}</Text>
                    </button>
                {/each}
            </nav>
        </button>
    </actions>
</amount-input>
