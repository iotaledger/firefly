import { HEXADECIMAL_PREFIX, HEXADECIMAL_REGEXP } from './constants'

export function formatHexString(
    hex: string,
    shouldBeUppercase: boolean = true,
    shouldIncludePrefix: boolean = true
): string {
    if (!hex || !HEXADECIMAL_REGEXP.test(hex)) {
        return '00'
    }

    hex = hex.replace(HEXADECIMAL_PREFIX, '')

    let result = ''
    if (shouldIncludePrefix) {
        result += HEXADECIMAL_PREFIX
    }

    result += shouldBeUppercase ? hex.toUpperCase() : hex.toLowerCase()

    return result
}
