import { getDecimalSeparator } from './getDecimalSeparator'

export function ensureZeroes(val: string, maxZeros: number): string {
    const decimalSeparator = getDecimalSeparator()

    const parts = val.split(decimalSeparator)

    if (parts.length === 1) {
        parts[1] = ''
        if (maxZeros > 0) {
            parts[1].padEnd(maxZeros, '0')
        }
    }

    // If there are more then decimal places and it is just 0s remove them
    if (parts[1].length > maxZeros) {
        parts[1] = `${parts[1].slice(0, maxZeros)}${parts[1].slice(maxZeros).replace(/0+$/, '')}`
    }

    if (parts[1].length > 0) {
        return `${parts[0]}${decimalSeparator}${parts[1]}`
    } else {
        return parts[0]
    }
}
