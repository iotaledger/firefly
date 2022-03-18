export function toHexString(bytes: number[]): string | undefined {
    if (!bytes || bytes.length <= 0) return undefined

    return bytes.map((byte) => (byte & 0xff).toString(16).padStart(2, '0')).join('')
}

export function toUtf8String(bytes: Uint8Array | number[]): string | undefined {
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
                if ((_char & 0xc0) != 0x80) return null

                char = (char << 6) | (_char & 0x3f)
            }
        }

        result += String.fromCharCode(char)
    }

    return result
}
