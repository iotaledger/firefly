/**
 * Returns a randomly generated ID (hexadecimal).
 */
export const generateRandomId = (): string =>
    Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join(
        ''
    )

/**
 * Returns a randomly generated integer within a specified range (inclusive of beginning, exclusive of end).
 */
export const generateRandomInteger = (beginning: number, end: number): number =>
    Math.floor(Math.random() * end + beginning)

export const pick = <T>(arr: T[]): T | undefined => {
    const length = arr?.length
    if (length < 1) return undefined

    const randIdx = Math.floor(Math.random() * length)
    return arr[randIdx] || undefined
}
