import Big from 'big.js'

import { formatNumber, getCurrencyPosition } from '@core/i18n'

import { DEFAULT_FORMAT_IOTA_UNIT_OPTIONS, IOTA_UNIT_MAP } from './constants'
import { IotaUnit } from './enums'
import { FormatIotaUnitOptions } from './interfaces'

/**
 * CAUTION: Set this to avoid small numbers switching to exponential format.
 */
Big.NE = -20

export function convertIotaUnit(value: number, fromUnit: IotaUnit, toUnit: IotaUnit): number {
    if (value === 0 || fromUnit === toUnit) {
        return value
    }

    const scaledValue = Number(new Big(value).times(IOTA_UNIT_MAP[fromUnit].value).div(IOTA_UNIT_MAP[toUnit].value))

    return toUnit === IotaUnit._ ? Math.round(scaledValue) : scaledValue
}

export function formatIotaUnitPrecision(
    valueRaw: number,
    unit: IotaUnit,
    options: FormatIotaUnitOptions = DEFAULT_FORMAT_IOTA_UNIT_OPTIONS
): string {
    const { includeUnits, grouped, overrideDecimalPlaces } = options

    // At the moment we have no symbol for IOTA so we always put the currency code
    // at the end, in the future when we have a symbol this can be updated to position
    // it correctly to the left when necessary
    const currencyPosition = getCurrencyPosition()

    if (!valueRaw) {
        return includeUnits ? `0 ${unit}` : '0'
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
    valueRaw: number,
    options: FormatIotaUnitOptions = DEFAULT_FORMAT_IOTA_UNIT_OPTIONS
): string {
    return formatIotaUnitPrecision(valueRaw, getIotaUnit(valueRaw), options)
}

export function getIotaUnit(value: number): IotaUnit {
    if (!value || value === 0) {
        return IotaUnit.M
    }

    const checkLength = Math.abs(value).toString().length

    for (const unit of [IotaUnit.P, IotaUnit.T, IotaUnit.G, IotaUnit.M, IotaUnit.K]) {
        if (checkLength > IOTA_UNIT_MAP[unit].decimalPlaces) {
            return unit
        }
    }

    return IotaUnit._
}
