// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
import { Base64 } from './base64'

/**
 * Convert arrays to and from different formats.
 */
export class Converter {
    /**
     * Lookup table for encoding.
     * @internal
     */
    private static ENCODE_LOOKUP: string[] | undefined

    /**
     * Lookup table for decoding.
     * @internal
     */
    private static DECODE_LOOKUP: number[] | undefined

    /**
     * Encode a raw array to UTF8 string.
     * @param array The bytes to encode.
     * @param startIndex The index to start in the bytes.
     * @param length The length of bytes to read.
     * @returns The array formated as UTF8.
     */
    public static bytesToUtf8(array: ArrayLike<number>, startIndex?: number, length?: number | undefined): string {
        const start = startIndex ?? 0
        const len = length ?? array.length
        let str = ''

        for (let i = start; i < start + len; i++) {
            const value = array[i]

            if (value < 0x80) {
                str += String.fromCharCode(value)
            } else if (value > 0xbf && value < 0xe0) {
                str += String.fromCharCode(((value & 0x1f) << 6) | (array[i + 1] & 0x3f))
                i += 1
            } else if (value > 0xdf && value < 0xf0) {
                str += String.fromCharCode(
                    ((value & 0x0f) << 12) | ((array[i + 1] & 0x3f) << 6) | (array[i + 2] & 0x3f)
                )
                i += 2
            } else {
                // surrogate pair
                const charCode =
                    (((value & 0x07) << 18) |
                        ((array[i + 1] & 0x3f) << 12) |
                        ((array[i + 2] & 0x3f) << 6) |
                        (array[i + 3] & 0x3f)) -
                    0x010000

                str += String.fromCharCode((charCode >> 10) | 0xd800, (charCode & 0x03ff) | 0xdc00)
                i += 3
            }
        }

        return str
    }

    /**
     * Convert a UTF8 string to raw array.
     * @param utf8 The text to decode.
     * @returns The array.
     */
    public static utf8ToBytes(utf8: string): Uint8Array {
        const bytes: number[] = []

        for (let i = 0; i < utf8.length; i++) {
            let charcode = utf8.charCodeAt(i)
            if (charcode < 0x80) {
                bytes.push(charcode)
            } else if (charcode < 0x800) {
                bytes.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                bytes.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f))
            } else {
                // surrogate pair
                i++
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (utf8.charCodeAt(i) & 0x3ff))
                bytes.push(
                    0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f)
                )
            }
        }

        return Uint8Array.from(bytes)
    }

    /**
     * Encode a raw array to hex string.
     * @param array The bytes to encode.
     * @param startIndex The index to start in the bytes.
     * @param length The length of bytes to read.
     * @param reverse Reverse the combine direction.
     * @returns The array formated as hex.
     */
    public static bytesToHex(
        array: ArrayLike<number>,
        startIndex?: number,
        length?: number | undefined,
        reverse?: boolean
    ): string {
        let hex = ''
        this.buildHexLookups()
        if (Converter.ENCODE_LOOKUP) {
            const len = length ?? array.length
            const start = startIndex ?? 0
            if (reverse) {
                for (let i = 0; i < len; i++) {
                    hex = Converter.ENCODE_LOOKUP[array[start + i]] + hex
                }
            } else {
                for (let i = 0; i < len; i++) {
                    hex += Converter.ENCODE_LOOKUP[array[start + i]]
                }
            }
        }
        return hex
    }

    /**
     * Decode a hex string to raw array.
     * @param hex The hex to decode.
     * @param reverse Store the characters in reverse.
     * @returns The array.
     */
    public static hexToBytes(hex: string, reverse?: boolean): Uint8Array {
        const sizeof = hex?.length >> 1
        const length = sizeof << 1
        const array = new Uint8Array(sizeof)

        this.buildHexLookups()
        if (Converter.DECODE_LOOKUP) {
            let i = 0
            let n = 0
            while (i < length) {
                array[n++] =
                    (Converter.DECODE_LOOKUP[hex.charCodeAt(i++)] << 4) | Converter.DECODE_LOOKUP[hex.charCodeAt(i++)]
            }

            if (reverse) {
                array.reverse()
            }
        }
        return array
    }

    /**
     * Convert the UTF8 to hex.
     * @param utf8 The text to convert.
     * @returns The hex version of the bytes.
     */
    public static utf8ToHex(utf8: string, prefix = false): string {
        return prefix
            ? '0x' + Converter.bytesToHex(Converter.utf8ToBytes(utf8))
            : Converter.bytesToHex(Converter.utf8ToBytes(utf8))
    }

    /**
     * Convert the hex text to text. The UTF8 string is sliced, since it is padded with a non-ut8 character.
     * @param hex The hex to convert.
     * @returns The UTF8 version of the bytes.
     */
    public static hexToUtf8(hex: string): string {
        const bytes = Converter.hexToBytes(hex)
        return Converter.bytesToUtf8(bytes)?.slice(1)
    }

    public static decimalToHex(number: number, prefix = false): string {
        return prefix ? '0x' + number.toString(16) : number.toString(16)
    }

    /**
     * Is the data hex format.
     * @param value The value to test.
     * @returns True if the string is hex.
     */
    public static isHex(value: string): boolean {
        if (value.length % 2 === 1) {
            return false
        }
        return /^[\da-f]+$/g.test(value)
    }

    /**
     * Convert bytes to binary string.
     * @param bytes The bytes to convert.
     * @returns A binary string of the bytes.
     */
    public static bytesToBinary(bytes: Uint8Array): string {
        const b = []
        for (let i = 0; i < bytes.length; i++) {
            b.push(bytes[i].toString(2).padStart(8, '0'))
        }
        return b.join('')
    }

    /**
     * Convert a binary string to bytes.
     * @param binary The binary string.
     * @returns The bytes.
     */
    public static binaryToBytes(binary: string): Uint8Array {
        const bytes = new Uint8Array(Math.ceil(binary.length / 8))
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = Number.parseInt(binary.slice(i * 8, (i + 1) * 8), 2)
        }
        return bytes
    }

    /**
     * Convert bytes to base64 string.
     * @param bytes The bytes to convert.
     * @returns A base64 string of the bytes.
     */
    public static bytesToBase64(bytes: Uint8Array): string {
        return Base64.encode(bytes)
    }

    /**
     * Convert a base64 string to bytes.
     * @param base64 The base64 string.
     * @returns The bytes.
     */
    public static base64ToBytes(base64: string): Uint8Array {
        return Base64.decode(base64)
    }

    /**
     * Build the static lookup tables.
     * @internal
     */
    private static buildHexLookups(): void {
        if (!Converter.ENCODE_LOOKUP || !Converter.DECODE_LOOKUP) {
            const alphabet = '0123456789abcdef'
            Converter.ENCODE_LOOKUP = []
            Converter.DECODE_LOOKUP = []

            for (let i = 0; i < 256; i++) {
                Converter.ENCODE_LOOKUP[i] = alphabet[(i >> 4) & 0xf] + alphabet[i & 0xf]
                if (i < 16) {
                    if (i < 10) {
                        Converter.DECODE_LOOKUP[0x30 + i] = i
                    } else {
                        Converter.DECODE_LOOKUP[0x61 - 10 + i] = i
                    }
                }
            }
        }
    }
}
