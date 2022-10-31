import Big from 'big.js'

import { formatNumber, getCurrencyPosition } from '@core/i18n'

import { IOTA_UNIT_MAP } from './constants'
import { IotaUnit } from './enums'

/**
 * CAUTION: Set this to avoid small numbers switching to exponential format.
 */
Big.NE = -20

export function convertIotaUnit(value: number, fromUnit: IotaUnit, toUnit: IotaUnit): number {
    if (value === 0) {
        return 0
    }

    if (fromUnit === toUnit) {
        return value
    }

    const scaledValue = Number(new Big(value).times(IOTA_UNIT_MAP[fromUnit].value).div(IOTA_UNIT_MAP[toUnit].value))

    return toUnit === IotaUnit._ ? Math.round(scaledValue) : scaledValue
}

export function formatIotaUnitPrecision(
    valueRaw: number,
    unit: IotaUnit,
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

    const converted = convertIotaUnit(valueRaw, IotaUnit._, unit)

    const formatted = formatNumber(
        converted,
        overrideDecimalPlaces ?? IOTA_UNIT_MAP[unit].decimalPlaces,
        overrideDecimalPlaces ?? IOTA_UNIT_MAP[unit].decimalPlaces,
        unit === IotaUnit._ ? 0 : 2,
        grouped
    )

    if (includeUnits) {
        return currencyPosition === 'left' ? `${formatted} ${unit}` : `${formatted} ${unit}`
    } else {
        return formatted
    }
}

export function formatIotaUnitBestMatch(
    value: number,
    includeUnits: boolean = true,
    overrideDecimalPlaces?: number
): string {
    return formatIotaUnitPrecision(value, getIotaUnit(value), includeUnits, false, overrideDecimalPlaces)
}

export function getIotaUnit(value: number): IotaUnit {
    let bestUnits: IotaUnit = IotaUnit._

    if (!value || value === 0) {
        return IotaUnit.M
    }

    const checkLength = Math.abs(value).toString().length

    if (checkLength > IOTA_UNIT_MAP.P.decimalPlaces) {
        bestUnits = IotaUnit.P
    } else if (checkLength > IOTA_UNIT_MAP.T.decimalPlaces) {
        bestUnits = IotaUnit.T
    } else if (checkLength > IOTA_UNIT_MAP.G.decimalPlaces) {
        bestUnits = IotaUnit.G
    } else if (checkLength > IOTA_UNIT_MAP.M.decimalPlaces) {
        bestUnits = IotaUnit.M
    } else if (checkLength > IOTA_UNIT_MAP.k.decimalPlaces) {
        bestUnits = IotaUnit.K
    }

    return bestUnits
}
