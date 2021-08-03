<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Input, Text } from 'shared/components'
    import {
        AvailableExchangeRates,
        convertFromFiat,
        convertToFiat,
        currencies,
        CurrencyTypes,
        exchangeRates,
        formatCurrency,
        isFiatCurrency,
        parseCurrency,
        replaceCurrencyDecimal,
    } from 'shared/lib/currency'
    import { activeProfile } from 'shared/lib/profile'
    import { changeUnits, formatUnitBestMatch, formatUnitPrecision, UNIT_MAP } from 'shared/lib/units'

    type AmountUnit = Unit | string

    export let locale = undefined

    export let amount = undefined
    export let unit: AmountUnit = Unit.Mi
    export let label = undefined
    export let placeholder = undefined

    export let classes = ''
    export let disabled = false
    export let autofocus = false
    export let error = ''
    export let maxClick = () => {}

    let profileCurrency: AvailableExchangeRates = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD

    const Units: AmountUnit[]
        = [profileCurrency as string].concat(Object.values(Unit).filter(x => x !== 'Pi').map(x => x as string))

    const MAX_VALUE = 2_779_530_283_000_000

    let showDropdown = false
    let navContainer
    let unitsButton
    let focusedItem

    const amountToFiat = (_amount) => {
        if (!amount) return null

        if(isFiatCurrency(unit)) return _amount

        const amountAsFloat = parseCurrency(_amount)
        if (amountAsFloat === 0 || Number.isNaN(amountAsFloat)) {
            return null
        } else {
            const rawAmount = changeUnits(amountAsFloat, unit as Unit, Unit.i)
            const fiatAmount = convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[profileCurrency])

            return fiatAmount === 0 ? replaceCurrencyDecimal(`< 0.01`) : formatCurrency(fiatAmount)
        }
    }

    const amountFromFiat = (_amount) => {
        if(!amount) return null

        if(!isFiatCurrency(unit)) return _amount

        const amountAsFloat = parseCurrency(_amount, unit)
        if (amountAsFloat === 0 || Number.isNaN(amountAsFloat)) {
            return null
        } else {
            const rawAmount = convertFromFiat(amountAsFloat, $currencies[CurrencyTypes.USD], $exchangeRates[profileCurrency])

            return formatUnitBestMatch(rawAmount)
        }
    }

    const getFormattedLabel = (_amount) => {
        return isFiatCurrency(unit) ? amountFromFiat(_amount) : amountToFiat(_amount)
    }

    $: amountForLabel = getFormattedLabel(amount)
    $: {
        if (amount.length > 0) {
            // const rawVal = changeUnits(parseCurrency(amount), unit, Unit.i)
            // if (rawVal > MAX_VALUE) {
            //     amount = formatUnitPrecision(MAX_VALUE, unit, false)
            // }
            if(!isFiatCurrency(unit)) {
                const amountAsFloat = parseCurrency(amount)
                const rawAmount = changeUnits(
                    Number.isNaN(amountAsFloat) ? 0 : amountAsFloat,
                    unit as Unit,
                    Unit.i
                )
                if(rawAmount > MAX_VALUE) {
                    amount = formatUnitPrecision(MAX_VALUE, unit as Unit, false)
                }
            } else {
                const rawAmount = convertFromFiat(amount, $currencies[CurrencyTypes.USD], $exchangeRates[profileCurrency])
                if(rawAmount > MAX_VALUE) {
                    amount = convertToFiat(MAX_VALUE, $currencies[CurrencyTypes.USD], $exchangeRates[profileCurrency])
                }
            }
        }
    }

    const onOutsideClick = () => {
        showDropdown = false
    }

    const onUnitSelect = (toUnit: AmountUnit) => {
        updateAmount(unit, toUnit)

        unit = toUnit
    }

    const updateAmount = (fromUnit: AmountUnit, toUnit: AmountUnit) => {
        if(amount.length <= 0 || fromUnit === toUnit) return

        if(isFiatCurrency(toUnit)) { // IOTA -> FIAT
            amount = amountToFiat(amount).slice(2)
        } else {
            let rawAmount
            if(isFiatCurrency(fromUnit)) // FIAT -> IOTA
                rawAmount = convertFromFiat(amount, $currencies[CurrencyTypes.USD], $exchangeRates[profileCurrency])
            else // IOTA -> IOTA
                rawAmount = changeUnits(parseCurrency(amount), fromUnit as Unit, Unit.i)

            amount = formatUnitPrecision(rawAmount, toUnit as Unit, false)
        }
    }

    const onFocus = (itemId) => {
        focusedItem = document.getElementById(itemId)
    }

    const onKey = (e) => {
        if (showDropdown) {
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
            } else if (e.key === 'Enter') {
                if(focusedItem) {
                    const idx = [...navContainer.children].indexOf(focusedItem)
                    onUnitSelect(Units[idx])
                }
            }
        }
    }

    const toggleDropDown = () => {
        showDropdown = !showDropdown
        if (showDropdown) {
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

    const getMaxDecimals = (_unit: AmountUnit) => {
        return isFiatCurrency(_unit) ? 2 : UNIT_MAP[_unit].dp
    }
</script>

<style type="text/scss">
    amount-input {
        nav {
            &.showDropdown {
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

<svelte:window on:click={onOutsideClick} />
<amount-input class:disabled class="relative block {classes}" on:keydown={onKey}>
    <Input
        {error}
        label={amountForLabel ?? (label || locale('general.amount'))}
        placeholder={placeholder || locale('general.amount')}
        bind:value={amount}
        maxlength={17}
        {disabled}
        {autofocus}
        maxDecimals={getMaxDecimals(unit)}
        integer={unit === Unit.i}
        float={unit !== Unit.i}
        style={showDropdown ? 'border-bottom-right-radius: 0' : ''}
        isFocused={showDropdown} />
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
                class:showDropdown
                bind:this={navContainer}>
                {#each Units as _unit}
                    <button
                        id={_unit}
                        class="text-center w-full py-2 {unit === _unit && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'} 
                        hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20
                        focus:bg-gray-200 dark:focus:bg-gray-800 dark:focus:bg-opacity-20"
                        on:click={() => onUnitSelect(_unit)}
                        on:focus={() => onFocus(_unit)}
                        class:active={unit === _unit}
                        tabindex={showDropdown ? 0 : -1}>
                        <Text type="p" smaller>{_unit}</Text>
                    </button>
                {/each}
            </nav>
        </button>
    </actions>
</amount-input>
