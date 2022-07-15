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
