<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Input, Text } from 'shared/components'
    import { convertUnitsNoE } from 'shared/lib/units'

    export let amount = undefined
    export let unit = Unit.Mi
    export let label = undefined
    export let placeholder = undefined
    export let locale = undefined
    export let classes = ''
    export let maxClick = () => {}
    export let error = ''
    export let disabled = false
    export let autofocus = false

    const Units = Object.values(Unit).filter((x) => x !== 'Pi')

    let dropdown = false

    const clickOutside = () => {
        dropdown = false
    }
    const onSelect = (index) => {
        amount = convertUnitsNoE(amount, unit, index)
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
            actions {
                @apply opacity-50;
            }
        }
    }
</style>

<svelte:window on:click={clickOutside} />
<amount-input class:disabled class="relative block {classes}">
    <Input
        {error}
        label={label || locale('general.amount')}
        placeholder={placeholder || locale('general.amount')}
        bind:value={amount}
        maxlength={17}
        {disabled}
        {autofocus}
        integer={unit === Unit.i}
        float={unit !== Unit.i} />
    <actions class="absolute right-0 top-2.5 h-8 flex flex-row items-center text-12 text-gray-500 dark:text-white">
        <button
            on:click={maxClick}
            class={`pr-3 ${disabled ? 'cursor-auto' : 'hover:text-blue-500 focus:text-blue-500 cursor-pointer'}`}
            {disabled}>{locale('actions.max').toUpperCase()}</button>
        <button
            on:click={(e) => {
                e.preventDefault()
                e.stopPropagation()
                dropdown = !dropdown
            }}
            class={`w-10 h-full text-center px-2 border-l border-solid border-gray-300 dark:border-gray-700 ${disabled ? 'cursor-auto' : 'hover:text-blue-500 focus:text-blue-500 cursor-pointer'}`}
            {disabled}>
            {unit}
            {#if !disabled && dropdown}
                <nav
                    class="absolute w-10 overflow-y-auto z-10 text-left top-11 right-0 rounded-lg bg-white dark:bg-gray-800 border border-solid border-gray-300 dark:border-gray-700">
                    {#each Units as _unit}
                        <button
                            id={_unit}
                            class="text-center w-full py-2 {unit === _unit && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'} 
                            hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                            on:click={() => onSelect(_unit)}
                            class:active={unit === _unit}>
                            <Text type="p" smaller>{_unit}</Text>
                        </button>
                    {/each}
                </nav>
            {/if}
        </button>
    </actions>
</amount-input>
