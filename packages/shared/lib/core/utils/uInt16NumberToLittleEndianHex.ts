export function uInt16NumberToLittleEndianHex(num: number): string {
    const littleEndianNumber = ((num & 0xff) << 8) | ((num >> 8) & 0xff)
    const hex = ('0000' + littleEndianNumber.toString(16).toUpperCase()).slice(-4)
    return hex
}
