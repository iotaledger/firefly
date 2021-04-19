<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Input, Text } from 'shared/components'
    import {
        AvailableExchangeRates,
        convertToFiat,
        currencies,
        CurrencyTypes,
        exchangeRates,
        formatCurrency,
        parseCurrency,
        replaceCurrencyDecimal,
    } from 'shared/lib/currency'
    import { activeProfile } from 'shared/lib/profile'
    import { changeUnits, formatUnitPrecision, UNIT_MAP } from 'shared/lib/units'

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
    const MAX_VALUE = 2779530283000000

    let dropdown = false
    let navContainer
    let unitsButton
    let focusedItem

    let profileCurrency: AvailableExchangeRates = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD
    $: fiatAmount = amountToFiat(amount)
    $: {
        if (amount.length > 0) {
            const rawVal = changeUnits(parseCurrency(amount), unit, Unit.i)
            if (rawVal > MAX_VALUE) {
                amount = formatUnitPrecision(MAX_VALUE, unit, false)
            }
        }
    }

    const clickOutside = () => {
        dropdown = false
    }
    const onSelect = (index) => {
        if (amount.length > 0) {
            amount = formatUnitPrecision(changeUnits(parseCurrency(amount), unit, Unit.i), index, false)
        }
        unit = index
    }

    const focusItem = (itemId) => {
        let elem = document.getElementById(itemId)
        focusedItem = elem
    }

    const handleKey = (e) => {
        if (dropdown) {
            if (e.key === 'Escape') {
                toggleDropDown()
                e.preventDefault()
            } else if (e.key === 'ArrowDown') {
                if (focusedItem) {
                    const children = [...navContainer.children]
                    const idx = children.indexOf(focusedItem)
                    if (idx < children.length - 1) {
                        children[idx + 1].focus()
                        e.preventDefault()
                    }
                }
            } else if (e.key === 'ArrowUp') {
                if (focusedItem) {
                    const children = [...navContainer.children]
                    const idx = children.indexOf(focusedItem)
                    if (idx > 0) {
                        children[idx - 1].focus()
                        e.preventDefault()
                    }
                }
            }
        }
    }

    const toggleDropDown = () => {
        dropdown = !dropdown
        if (dropdown) {
            let elem = document.getElementById(unit)
            if (!elem) {
                elem = navContainer.firstChild
            }
            if (elem) {
                elem.focus()
            }
        } else {
            unitsButton.focus()
            focusedItem = undefined
        }
    }

    const amountToFiat = (_amount) => {
        if (!amount) return null
        const amountAsFloat = parseCurrency(_amount)
        if (amountAsFloat === 0 || Number.isNaN(amountAsFloat)) {
            return null
        } else {
            const amountAsI = changeUnits(amountAsFloat, unit, Unit.i)
            const amountasFiat = convertToFiat(amountAsI, $currencies[CurrencyTypes.USD], $exchangeRates[profileCurrency])
            return amountasFiat === 0 ? replaceCurrencyDecimal(`< 0.01`) : formatCurrency(amountasFiat)
        }
    }
</script>

<style type="text/scss">
    amount-input {
        nav {
            &.dropdown {
                @apply opacity-100;
                @apply pointer-events-auto;
            }
        }

        &.disabled {
            @apply pointer-events-none;
            actions {
                @apply opacity-50;
            }
        }
    }
</style>

<svelte:window on:click={clickOutside} />
<amount-input class:disabled class="relative block {classes}" on:keydown={handleKey}>
    <Input
        {error}
        label={fiatAmount ?? (label || locale('general.amount'))}
        placeholder={placeholder || locale('general.amount')}
        bind:value={amount}
        maxlength={17}
        {disabled}
        {autofocus}
        maxDecimals={UNIT_MAP[unit].dp}
        integer={unit === Unit.i}
        float={unit !== Unit.i}
        style={dropdown ? 'border-bottom-right-radius: 0' : ''}
        isFocused={dropdown} />
    <actions class="absolute right-0 top-2.5 h-8 flex flex-row items-center text-12 text-gray-500 dark:text-white">
        <button
            on:click={maxClick}
            class={`pr-2 ${disabled ? 'cursor-auto' : 'hover:text-blue-500 focus:text-blue-500 cursor-pointer'}`}
            {disabled}>{locale('actions.max').toUpperCase()}</button>
        <button
            on:click={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleDropDown()
            }}
            bind:this={unitsButton}
            class={`w-10 h-full text-center px-2 border-l border-solid border-gray-300 dark:border-gray-700 ${disabled ? 'cursor-auto' : 'hover:text-blue-500 focus:text-blue-500 cursor-pointer'}`}
            {disabled}>
            {unit}
            <nav
                class="absolute w-10 overflow-y-auto pointer-events-none opacity-0 z-10 text-left top-10 right-0 rounded-b-lg bg-white dark:bg-gray-800 border border-solid border-blue-500"
                class:dropdown
                bind:this={navContainer}>
                {#each Units as _unit}
                    <button
                        id={_unit}
                        class="text-center w-full py-2 {unit === _unit && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'} 
                        hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20
                        focus:bg-gray-200 dark:focus:bg-gray-800 dark:focus:bg-opacity-20"
                        on:click={() => onSelect(_unit)}
                        on:focus={() => focusItem(_unit)}
                        class:active={unit === _unit}
                        tabindex={dropdown ? 0 : -1}>
                        <Text type="p" smaller>{_unit}</Text>
                    </button>
                {/each}
            </nav>
        </button>
    </actions>
</amount-input>
