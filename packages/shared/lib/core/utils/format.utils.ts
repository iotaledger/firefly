import { formatDate } from '@core/i18n'

import { HEXADECIMAL_PREFIX, HEXADECIMAL_REGEXP } from './constants'

export function capitalizeString(str: string): string {
    if (!str) return str
    else return str[0].toUpperCase() + str.substr(1).toLowerCase()
}

export function delineateNumber(str: string, delineator: ',' | '.' | '' = ','): string {
    if (!str) return ''

    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delineator)
}

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

export function getMonthYear(date: Date): string {
    return formatDate(date, { year: 'numeric', month: 'short' })
}
