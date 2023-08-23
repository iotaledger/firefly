import { get } from 'svelte/store'

import { appSettings } from '@core/app'

import { ensureZeroes } from './ensureZeroes'

export function formatNumber(
    value: number,
    minDecimals: number | undefined = undefined,
    maxDecimals: number | undefined = undefined,
    maxZeros: number = 2,
    grouped: boolean = false
): string {
    // The decimals are truncated anyway if the value is larger than what JS can represent safely.
    if (value > Number.MAX_SAFE_INTEGER) {
        return String(value)
    }

    // The maximum decimals are equal to the max decimals of Ethereum.
    // Larger values throw an error when trying to format.
    if (maxDecimals && maxDecimals > 18) {
        return String(value)
    }

    const appLanguage = get(appSettings).language

    const formatted = Intl.NumberFormat(appLanguage, {
        minimumFractionDigits: minDecimals ?? (maxDecimals ? Math.min(maxDecimals, 2) : 2),
        maximumFractionDigits: maxDecimals,
        useGrouping: grouped,
    }).format(value)

    return ensureZeroes(formatted, maxZeros)
}
