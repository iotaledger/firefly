import { MILLISECONDS_PER_SECOND } from '@lib/time'

/**
 * Returns a UNIX timestamp from a given Date object.
 */
export function convertDateToUnixTimestamp(date: Date): number {
    if (date) {
        return Math.round(date.getTime() / MILLISECONDS_PER_SECOND)
    } else {
        return undefined
    }
}

/**
 * Returns a Date object from a given UNIX timestamp.
 */
export function convertUnixTimestampToDate(timestamp: number): Date {
    if (timestamp) {
        return new Date(timestamp * MILLISECONDS_PER_SECOND)
    } else {
        return undefined
    }
}

export function convertUInt16NumberToLittleEndianHex(num: number): string {
    const littleEndianNumber = ((num & 0xff) << 8) | ((num >> 8) & 0xff)
    const hex = ('0000' + littleEndianNumber.toString(16).toUpperCase()).slice(-4)
    return hex
}

export function convertBytesToUtf8String(bytes: Uint8Array | number[]): string | undefined {
    if (!bytes || bytes.length <= 0) return undefined

    const extraByteMap = [1, 1, 1, 1, 2, 2, 3, 0]
    const charCount = bytes.length

    let result = ''

    for (let idx = 0; idx < charCount; ) {
        let char = bytes[idx++]
        if (char & 0x80) {
            let extraChar = extraByteMap[(char >> 3) & 0x07]
            if (!(char & 0x40) || !extraChar || idx + extraChar > charCount) return null

            char = char & (0x3f >> extraChar)
            for (; extraChar > 0; extraChar--) {
                const _char = bytes[idx++]
                if ((_char & 0xc0) !== 0x80) return null

                char = (char << 6) | (_char & 0x3f)
            }
        }

        result += String.fromCharCode(char)
    }

    return result
}

export function convertBytesToHexString(bytes: number[]): string | undefined {
    if (!bytes || bytes.length <= 0) return undefined

    return bytes.map((byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('')
}
