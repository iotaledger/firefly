export function isStringTrue(value: string): boolean {
    return value === 'true'
}

export function getByteLengthOfString(str: string): number {
    return new Blob([str]).size
}

/**
 * Strip trailing slashes from the text
 * @param str The text to strip the values from
 * @returns The stripped text
 */
export function stripTrailingSlash(str: string): string {
    return str ? str.replace(/\/+$/, '') : ''
}

/**
 * Strip spaces from the text
 * @param str The text to strip the values from
 * @returns The stripped text
 */
export function stripSpaces(str: string): string {
    return str ? str.replace(/ /g, '') : ''
}

/**
 * Truncate strings
 *
 * @param str: String which has to be truncated
 * @param firstCharCount: Number of characters which has to be shown as first portion. Default = 5
 * @param endCharCount: Number of characters which has to be shown at end portion. Default = 5
 * @param dotCount: Count of dots in between first and end portion. Default = 3
 */

export function truncateString(
    str: string = '',
    firstCharCount: number = 5,
    endCharCount: number = 5,
    dotCount: number = 3
): string {
    const maxLength = firstCharCount + endCharCount + dotCount
    if (!str || str.length <= maxLength) {
        return str
    }
    let convertedStr = ''
    convertedStr += str.substring(0, firstCharCount)
    convertedStr += '.'.repeat(dotCount)
    convertedStr += str.substring(str.length - endCharCount, str.length)
    return convertedStr
}

/**
 * Extract initials from string
 */
export function getInitials(name: string | undefined, maxChars?: number): string {
    if (!name || !name.trim() || (maxChars && maxChars < 0)) {
        return ''
    }

    let initialsArray = name
        .trim()
        .split(' ')
        .filter((n) => n)
        .map((n) => n.match(/./gu)) // match characters for emoji compatibility
        .filter((n): n is RegExpMatchArray => n !== null)
        .map((n) => n[0])

    if (maxChars !== undefined) {
        initialsArray = initialsArray.slice(0, maxChars)
    }

    return initialsArray.join('').toUpperCase()
}

/**
 * Get the length of a string after it has been trimmed supporting emojis
 * @param name The string to get the length of
 * @returns
 */
export function getTrimmedLength(name: string | undefined): number {
    if (!name) {
        return 0
    }

    return name.trim().match(/./gu)?.length ?? 0
}

export function getNthOccurrenceIndex(string: string, char: string, n: number): number {
    let index = -1
    while (n-- && index++ < string.length) {
        index = string.indexOf(char, index)
        if (index < 0) break
    }
    return index
}
