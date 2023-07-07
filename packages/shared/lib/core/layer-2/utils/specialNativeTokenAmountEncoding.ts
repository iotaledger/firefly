// Note: code provided by the IF smart contract team
export function specialNativeTokenAmountEncoding(big: bigint): Uint8Array {
    let hex = big.toString(16)
    // If the hexadecimal string has an odd length, add a leading '0' to make it even
    if (hex.length % 2) {
        hex = '0' + hex
    }
    const len = hex.length / 2
    const u8 = new Uint8Array(len)
    let i = 0
    let j = 0
    while (i < len) {
        u8[i] = parseInt(hex.slice(j, j + 2), 16)
        i += 1
        j += 2
    }
    return u8
}
