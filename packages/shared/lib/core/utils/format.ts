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
