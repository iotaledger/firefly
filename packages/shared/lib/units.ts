import { Unit } from '@iota/unit-converter'
import Big from 'big.js'
import { getCurrencyPosition, formatNumber } from 'shared/lib/currency'

// Set this to avoid small numbers switching to exponential format
Big.NE = -20

/**
 * IOTA Units Map
 */
export const UNIT_MAP: { [unit in Unit]: { val: number; dp: number } } = {
    i: { val: 1, dp: 0 },
    Ki: { val: 1000, dp: 3 },
    Mi: { val: 1000000, dp: 6 },
    Gi: { val: 1000000000, dp: 9 },
    Ti: { val: 1000000000000, dp: 12 },
    Pi: { val: 1000000000000000, dp: 15 },
}

/**
 * Formats IOTA value
 *
 * @method formatUnitBestMatch
 *
 * @param {number} value
 * @param {number} decimalPlaces
 * @param {boolean} includeUnits Include the units in the output
 *
 * @returns {string}
 */
export const formatUnitBestMatch = (value: number, includeUnits: boolean = true): string => {
    return formatUnitPrecision(value, getUnit(value), includeUnits)
}

/**
 * Format a value with the provided value precision
 * @param valueRaw The raw value to format
 * @param unit The unit precision
 * @param includeUnits Include the units in the output
 * @param grouped Group the thousands
 */
export function formatUnitPrecision(valueRaw: number, unit: Unit, includeUnits: boolean = true, grouped: boolean = false): string {
    if (!valueRaw) {
        return includeUnits ? `0 ${unit}` : '0'
    }

    const converted = changeUnits(valueRaw, Unit.i, unit)

    const formatted = formatNumber(converted, undefined, undefined, unit === Unit.i ? 0 : 2, grouped)

    if (includeUnits) {
        // At the moment we have no symbol for IOTA so we always put the currency code
        // at the end, in the future when we have a symbol this can be updated to position
        // it correctly to the left when necessary
        const currencyPosition = getCurrencyPosition()
        return currencyPosition === `left` ? `${formatted} ${unit}` : `${formatted} ${unit}`
    } else {
        return formatted
    }
}

/**
 * Gets relevant unit for IOTA value
 *
 * @method getUnit
 *
 * @param {number} value
 *
 * @returns {Unit}
 */
const getUnit = (value: number): Unit => {
    let bestUnits: Unit = Unit.i

    if (!value || value === 0) {
        return Unit.Mi
    }

    const checkLength = Math.abs(value).toString().length

    if (checkLength > UNIT_MAP.Pi.dp) {
        bestUnits = Unit.Pi
    } else if (checkLength > UNIT_MAP.Ti.dp) {
        bestUnits = Unit.Ti
    } else if (checkLength > UNIT_MAP.Gi.dp) {
        bestUnits = Unit.Gi
    } else if (checkLength > UNIT_MAP.Mi.dp) {
        bestUnits = Unit.Mi
    } else if (checkLength > UNIT_MAP.Ki.dp) {
        bestUnits = Unit.Ki
    }

    return bestUnits
}

/**
 * Convert the value to different units.
 * @param value The value to convert.
 * @param fromUnit The form unit.
 * @param toUnit The to unit.
 * @returns The formatted unit.
 */
export const changeUnits = (value: number, fromUnit: Unit, toUnit: Unit): number => {
    if (value === 0) {
        return 0;
    }

    if (fromUnit === toUnit) {
        return value;
    }

    const scaledValue = Number(new Big(value).times(UNIT_MAP[fromUnit].val).div(UNIT_MAP[toUnit].val))

    return toUnit === Unit.i ? Math.round(scaledValue) : scaledValue
}
