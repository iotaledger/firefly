export function isValidHexAddress(text: string): boolean {
    const isHex = text.startsWith('0x')
    return isHex && /^(0x)?[0-9a-f]{64}/i.test(text)
}
