<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Text } from 'shared/components'
    import Input from './Input'

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

<svelte:window on:click={clickOutside} />
<Text type="p" classes="mb-2" smaller>{label || locale('general.amount')}</Text>
<amount-input class="relative block {classes}">
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
            class="w-10 h-full text-center px-2 border-l border-solid border-gray-500"
            {disabled}>
            {unit}
            <nav
                class:active={dropdown && !disabled}
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
