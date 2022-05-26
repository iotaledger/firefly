import Big from 'big.js'
import BigNumber from 'bignumber.js'
import { getCurrencyPosition, formatNumber } from 'shared/lib/currency'

// Set this to avoid small numbers switching to exponential format
Big.NE = -20

export enum Unit {
    _ = '_',
    K = 'k',
    M = 'M',
    G = 'G',
    T = 'T',
    P = 'P',
}
export interface UnitMap {
    readonly [unit: string]: {
        readonly val: BigNumber
        readonly dp: number
    }
}

/**
 * IOTA Units Map
 */
export const UNIT_MAP: { [unit in Unit]: { val: number; dp: number } } = {
    [Unit._]: { val: 1, dp: 0 },
    [Unit.K]: { val: 1000, dp: 3 },
    [Unit.M]: { val: 1000000, dp: 6 },
    [Unit.G]: { val: 1000000000, dp: 9 },
    [Unit.T]: { val: 1000000000000, dp: 12 },
    [Unit.P]: { val: 1000000000000000, dp: 15 },
}

/**
 * The maximum number of IOTA tokens in the network.
 */
export const MAX_NUM_IOTAS = 2_779_530_283_277_761

/**
 * Formats IOTA value
 *
 * @method formatUnitBestMatch
 *
 * @param {number} value
 * @param {boolean} includeUnits Include the units in the output
 * @param {number} overrideDecimalPlaces Override the default decimal places.
 *
 * @returns {string}
 */
export const formatUnitBestMatch = (
    value: number,
    includeUnits: boolean = true,
    overrideDecimalPlaces?: number
): string => formatUnitPrecision(value, getUnit(value), includeUnits, false, overrideDecimalPlaces)

/**
 * Format a value with the provided value precision
 * @param valueRaw The raw value to format
 * @param unit The unit precision
 * @param includeUnits Include the units in the output
 * @param overrideDecimalPlaces Override the default decimal places.
 * @param grouped Group the thousands
 */
export function formatUnitPrecision(
    valueRaw: number,
    unit: Unit,
    includeUnits: boolean = true,
    grouped: boolean = false,
    overrideDecimalPlaces?: number
): string {
    // At the moment we have no symbol for IOTA so we always put the currency code
    // at the end, in the future when we have a symbol this can be updated to position
    // it correctly to the left when necessary
    const currencyPosition = getCurrencyPosition()

    if (!valueRaw) {
        return includeUnits ? (currencyPosition === 'left' ? `0 ${unit}` : `0 ${unit}`) : '0'
    }

    const converted = changeUnits(valueRaw, Unit._, unit)

    const formatted = formatNumber(
        converted,
        overrideDecimalPlaces ?? UNIT_MAP[unit].dp,
        overrideDecimalPlaces ?? UNIT_MAP[unit].dp,
        unit === Unit._ ? 0 : 2,
        grouped
    )

    if (includeUnits) {
        return currencyPosition === 'left' ? `${formatted} ${unit}` : `${formatted} ${unit}`
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
export const getUnit = (value: number): Unit => {
    let bestUnits: Unit = Unit._

    if (!value || value === 0) {
        return Unit.M
    }

    const checkLength = Math.abs(value).toString().length

    if (checkLength > UNIT_MAP.P.dp) {
        bestUnits = Unit.P
    } else if (checkLength > UNIT_MAP.T.dp) {
        bestUnits = Unit.T
    } else if (checkLength > UNIT_MAP.G.dp) {
        bestUnits = Unit.G
    } else if (checkLength > UNIT_MAP.M.dp) {
        bestUnits = Unit.M
    } else if (checkLength > UNIT_MAP.k.dp) {
        bestUnits = Unit.K
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
        return 0
    }

    if (fromUnit === toUnit) {
        return value
    }

    const scaledValue = Number(new Big(value).times(UNIT_MAP[fromUnit].val).div(UNIT_MAP[toUnit].val))

    return toUnit === Unit._ ? Math.round(scaledValue) : scaledValue
}
