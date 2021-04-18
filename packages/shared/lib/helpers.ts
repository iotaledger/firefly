import { writable, Writable } from 'svelte/store'
import type { Payload } from './typings/message'

/**
 * Update application path
 */
export const goto = (path: string): void => {
    window.location.hash = path
}

/**
 * Persist a writable Svelte store to local storage
 */
export const persistent = <T>(key: string, initialValue: T): Writable<T> => {
    let value = initialValue

    try {
        const json = localStorage.getItem(key)
        if (json) {
            value = JSON.parse(json)
        }
    } catch (err) {
        console.error(err)
    }

    const state = writable(value)

    state.subscribe(($value): void => {
        if ($value === undefined || $value === null) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, JSON.stringify($value))
        }
    })

    return state
}

/**
 * Get the length of a string after it has been trimmed supporting emojis
 * @param name The string to get the length of
 * @returns 
 */
export const getTrimmedLength = (name: string | undefined) => {
    if (!name) {
        return 0
    }

    return name.trim().match(/./gu)?.length ?? 0
}

/**
 * Does the string contain invalid filename chars
 * @param name The name to validate
 * @returns 
 */
export const validateFilenameChars = (name: string | undefined) => {
    if (!name) {
        return
    }
    if (name.startsWith("~")) {
        return 'tilde'
    }
    if (/[\u0000-\u001f\u0080-\u009f]/g.test(name)) {
        return 'control'
    }
    if (/^\.\./.test(name)) {
        return 'startDot';
    }
    if (/[<>:"/\\|?*]/g.test(name)) {
        return 'chars'
    }
}

/**
 * Extract initials from string
 */
export const getInitials = (name: string | undefined, maxChars: number) => {
    if (!name || !name.trim()) {
        return ""
    }

    let initialsArray = name
        .trim()
        .split(' ')
        .filter(n => n)
        .map(n => n.match(/./ug)) // match characters for emoji compatibility 
        .filter(n => n)
        .map(n => n[0])

    if (maxChars) {
        initialsArray = initialsArray.slice(0, maxChars)
    }

    return initialsArray.join('').toUpperCase()
}

/**
 * Truncate strings
 *
 * @param str: String which has to be truncated
 * @param firstCharCount: Number of characters which has to be shown as first portion. Default = 5
 * @param endCharCount: Number of characters which has to be shown at end portion. Default = 5
 * @param dotCount: Count of dots in between first and end portion. Default = 3
 */

export const truncateString = (str: string = '', firstCharCount: number = 5, endCharCount: number = 5, dotCount: number = 3) => {
    const MAX_LENGTH = 13
    if (!str || str.length <= MAX_LENGTH) {
        return str
    }
    let convertedStr = ''
    convertedStr += str.substring(0, firstCharCount)
    convertedStr += '.'.repeat(dotCount)
    convertedStr += str.substring(str.length - endCharCount, str.length)
    return convertedStr
}

/**
 * Get difference between two dates in weeks
 * @param firstDate: first date to compare
 * @param secondDate: second sate to compare
 */
export const diffDates = (firstDate: Date, secondDate: Date) => {
    if (!(firstDate instanceof Date) || !(secondDate instanceof Date)) {
        return null
    }
    const diff = Math.floor(secondDate.getTime() - firstDate.getTime())
    const day = 1000 * 60 * 60 * 24

    const days = Math.floor(diff / day)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(weeks / 4.33)
    const years = Math.floor(months / 12)

    if (years > 0) {
        return { unit: 'yearsAgo', value: years }
    }
    if (months > 0) {
        return { unit: 'monthsAgo', value: months }
    }
    if (weeks > 0) {
        return { unit: 'weeksAgo', value: weeks }
    }
    if (days > 0) {
        return { unit: 'daysAgo', value: days }
    }

    if (firstDate.getDate() !== secondDate.getDate()) {
        return { unit: 'yesterday' }
    }

    return { unit: 'today' }
}

/**
 * Get if a date is considered "recent". Less than 1 month is considered recent.
 * @param date: date to know if recent or not, compared to today. Must be in the past.
 */
export const isRecentDate = (date: Date) => {
    if (!(date instanceof Date)) {
        return null
    }
    const diff = Math.floor(new Date().getTime() - date.getTime())
    const day = 1000 * 60 * 60 * 24
    const days = Math.floor(diff / day)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(weeks / 4.33)
    const threeMonths = Math.floor(months / 3)

    return { lessThanAMonth: months == 0, lessThanThreeMonths: threeMonths == 0 }
}

/**
 * Returns warning text color for last Stronghold backup
 * @param lastBackupDate: Blue if less than a month. Orange if less than three months. Red if more.
 */
export const getBackupWarningColor = (lastBackupDate: Date) => {
    if (!(lastBackupDate instanceof Date)) {
        return 'red'
    }
    const { lessThanAMonth, lessThanThreeMonths } = isRecentDate(lastBackupDate)

    return lessThanAMonth ? 'blue' : lessThanThreeMonths ? 'yellow' : 'orange'
}

/**
 * Convert HEX color to RGBA
 * @param hexCode: hex color to convert
 * @param opacity: [0,100], default = 100
 */
export const convertHexToRGBA = (hexCode: string, opacity: number = 100) => {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity / 100})`;
};

/**
 * Strip trailing slashes from the text
 * @param str The text to strip the values from
 * @returns The stripped text
 */
export const stripTrailingSlash = (str) => {
    return str ? str.replace(/\/+$/, '') : ''
}

/**
 * Strip spaces from the text
 * @param str The text to strip the values from
 * @returns The stripped text
 */
export const stripSpaces = (str) => {
    return str ? str.replace(/ /g, '') : ''
}

/**
 * Get the sender address from a payload.
 */
export const sendAddressFromPayload = (payload: Payload): string => {
    return payload?.data?.essence?.data?.inputs?.find((input) => /utxo/i.test(input?.type))?.data?.metadata?.address ?? null
}

/**
 * Get the receiver addresses from the payload.
 */
export const receiverAddressesFromPayload = (payload: Payload): string[] => {
    return payload?.data?.essence?.data?.outputs
        ?.filter((output) => output?.data?.remainder === false)
        ?.map((output) => output?.data?.address) ?? []
}