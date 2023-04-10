<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Unit } from '@iota/unit-converter'
    import { Input, Text } from 'shared/components'
    import {
        convertFromFiat,
        convertToFiat,
        currencies,
        exchangeRates,
        formatCurrency,
        isFiatCurrency,
        parseCurrency,
    } from 'shared/lib/currency'
    import { activeProfile } from 'shared/lib/profile'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import { changeUnits, formatUnitBestMatch, formatUnitPrecision, MAX_NUM_IOTAS, UNIT_MAP } from 'shared/lib/units'
    import { onMount } from 'svelte'

    type AmountUnit = Unit | AvailableExchangeRates

    export let amount = undefined
    export let unit: AmountUnit = Unit.Mi
    export let placeholder = undefined
    export let classes = ''
    export let error = ''
    export let disabled = false
    export let autofocus = false

    export let onMaxClick = (): void => {}

    const currency = $activeProfile?.settings.currency ?? (AvailableExchangeRates.USD as AmountUnit)
    const units: AmountUnit[] = [currency].concat(Object.values(Unit).filter((u) => u !== 'Pi'))

    let showDropdown = false

    let navContainer
    let unitsButton
    let focusedItem
    let amountForLabel

    let navigationMenuAnchor
    let navigationMenuTop = 0
    let navigationMenuRight = 0

    const getFormattedLabel = (_amount) =>
        isFiatCurrency(unit) ? convertAmountFromFiat(_amount) : convertAmountToFiat(_amount)

    $: amount, unit, (amountForLabel = getFormattedLabel(amount))
    $: {
        if (amount.length > 0) {
            if (!isFiatCurrency(unit)) {
                const amountAsFloat = parseCurrency(amount)
                const rawAmount = changeUnits(Number.isNaN(amountAsFloat) ? 0 : amountAsFloat, unit as Unit, Unit.i)
                if (rawAmount > MAX_NUM_IOTAS) {
                    amount = formatUnitPrecision(MAX_NUM_IOTAS, unit as Unit, false)
                }
            } else {
                const rawAmount = convertFromFiat(amount, $currencies?.[CurrencyTypes.USD], $exchangeRates?.[currency])
                if (rawAmount > MAX_NUM_IOTAS) {
                    amount = convertToFiat(
                        MAX_NUM_IOTAS,
                        $currencies[CurrencyTypes.USD],
                        $exchangeRates[currency]
                    ).toString()
                }
            }
        }
    }

    onMount(updateNavigationMenuPosition)

    const convertAmountToFiat = (_amount) => {
        if (isFiatCurrency(unit)) return _amount

        const _convert = (amountAsFloat) => {
            const rawAmount = changeUnits(amountAsFloat, unit as Unit, Unit.i)
            const fiatAmount = convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[currency])

            return fiatAmount === 0
                ? rawAmount === 0
                    ? formatCurrency(0)
                    : '< ' + formatCurrency(0.01)
                : formatCurrency(fiatAmount)
        }

        return convertAmount(_amount, undefined, _convert)
    }
    const convertAmountFromFiat = (_amount) => {
        if (!isFiatCurrency(unit)) return _amount

        const _convert = (amountAsFloat) => {
            const rawAmount = convertFromFiat(amountAsFloat, $currencies[CurrencyTypes.USD], $exchangeRates[currency])

            return formatUnitBestMatch(rawAmount)
        }

        return convertAmount(_amount, unit, _convert)
    }

    const convertAmount = (_amount, _unit, convertFn) => {
        const amountAsFloat = parseCurrency(_amount, _unit)
        if (Number.isNaN(amountAsFloat)) return null

        return convertFn(amountAsFloat)
    }

    const onOutsideClick = () => {
        showDropdown = false
    }

    const onUnitClick = (toUnit: AmountUnit) => {
        unit = toUnit
    }

    const focusItem = (itemId) => {
        const elem = document.getElementById(itemId)
        focusedItem = elem
    }

    const handleKey = (e) => {
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
                if (focusedItem) {
                    const idx = [...navContainer.children].indexOf(focusedItem)
                    onUnitClick(units[idx])
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

    const getMaxDecimals = (_unit: AmountUnit) => (isFiatCurrency(_unit) ? 2 : UNIT_MAP[_unit].dp)

    function updateNavigationMenuPosition(): void {
        const inputElement = navigationMenuAnchor?.getElementsByTagName('input')?.[0]
        navigationMenuTop = inputElement?.getBoundingClientRect().top + inputElement?.offsetHeight
        navigationMenuRight = window.innerWidth - inputElement?.getBoundingClientRect().right
        navigationMenuAnchor.find
    }
</script>

<svelte:window on:click={onOutsideClick} on:resize={updateNavigationMenuPosition} />
<amount-input bind:this={navigationMenuAnchor} class:disabled class="relative block {classes}" on:keydown={handleKey}>
    <Input
        {error}
        label={amountForLabel || localize('general.amount')}
        placeholder={placeholder || localize('general.amount')}
        bind:value={amount}
        maxlength={17}
        {disabled}
        {autofocus}
        maxDecimals={getMaxDecimals(unit)}
        integer={unit === Unit.i}
        float={unit !== Unit.i}
        style={showDropdown ? 'border-bottom-right-radius: 0' : ''}
        isFocused={showDropdown}
    />
    <actions class="absolute right-0 top-2.5 h-8 flex flex-row items-center text-12 text-gray-500 dark:text-white">
        <button
            on:click={onMaxClick}
            class={`pr-2 ${disabled ? 'cursor-auto' : 'hover:text-blue-500 focus:text-blue-500 cursor-pointer'}`}
            {disabled}
        >
            {localize('actions.max').toUpperCase()}
        </button>
        <button
            on:click={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleDropDown()
            }}
            bind:this={unitsButton}
            class={`w-10 h-full text-center px-2 border-l border-solid border-gray-300 dark:border-gray-700 ${
                disabled ? 'cursor-auto' : 'hover:text-blue-500 focus:text-blue-500 cursor-pointer'
            }`}
            {disabled}
        >
            {unit}
            <nav
                class="fixed w-10 overflow-y-auto pointer-events-none opacity-0 z-10 text-left rounded-b-lg bg-white dark:bg-gray-800 border border-solid border-blue-500 {showDropdown
                    ? 'dropdown'
                    : ''}"
                style="top: {navigationMenuTop}px; right:{navigationMenuRight}px;"
                bind:this={navContainer}
            >
                {#each units as _unit}
                    <button
                        id={_unit}
                        class="text-center w-full py-2 {unit === _unit &&
                            'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'}
                        hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20
                        focus:bg-gray-200 dark:focus:bg-gray-800 dark:focus:bg-opacity-20"
                        on:click={() => onUnitClick(_unit)}
                        on:focus={() => focusItem(_unit)}
                        class:active={unit === _unit}
                        tabindex={showDropdown ? 0 : -1}
                    >
                        <Text type="p" smaller>{_unit}</Text>
                    </button>
                {/each}
            </nav>
        </button>
    </actions>
</amount-input>

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
