/**
 * Returns a capitalized version of a string.
 */
export function capitalize(str: string): string {
    if (!str) return str
    else return str[0].toUpperCase() + str.substr(1).toLowerCase()
}

/**
 * Returns an array of strings as the result of splitting a given string into chunks of a given size.
 */
export function chunkString(str: string, size: number = 0): string[] {
    if (!str) return []

    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
    }

    return chunks
}

/**
 * Returns a delineated format of a number.
 */
export function delineateNumber(str: string, delineator: ',' | '.' | '' = ','): string {
    if (!str) return ''

    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delineator)
}

/**
 * Extract initials from string
 */
export const getInitials = (name: string | undefined, maxChars: number): string => {
    if (!name || !name.trim()) {
        return ''
    }

    let initialsArray = name
        .trim()
        .split(' ')
        .filter((n) => n)
        .map((n) => n.match(/./gu)) // match characters for emoji compatibility
        .filter((n) => n)
        .map((n) => n[0])

    if (maxChars) {
        initialsArray = initialsArray.slice(0, maxChars)
    }

    return initialsArray.join('').toUpperCase()
}

/**
 * Get the length of a string after it has been trimmed supporting emojis
 * @param name The string to get the length of
 * @returns
 */
export const getTrimmedLength = (name: string | undefined): number => {
    if (!name) {
        return 0
    }

    return name.trim().match(/./gu)?.length ?? 0
}

/**
 * Strip spaces from the text
 * @param str The text to strip the values from
 * @returns The stripped text
 */
export const stripSpaces = (str: string): string => (str ? str.replace(/ /g, '') : '')

/**
 * Strip trailing slashes from the text
 * @param str The text to strip the values from
 * @returns The stripped text
 */
export const stripTrailingSlash = (str: string): string => (str ? str.replace(/\/+$/, '') : '')

/**
 * Truncate strings
 *
 * @param str: String which has to be truncated
 * @param firstCharCount: Number of characters which has to be shown as first portion. Default = 5
 * @param endCharCount: Number of characters which has to be shown at end portion. Default = 5
 * @param dotCount: Count of dots in between first and end portion. Default = 3
 */

export const truncateString = (
    str: string = '',
    firstCharCount: number = 5,
    endCharCount: number = 5,
    dotCount: number = 3
): string => {
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
