/**
 * Returns the outputId from transation id and output index.
 * @param transactionId The id of the transaction.
 * @param outputIndex The index of the output.
 * @returns The output id.
 */
export function outputIdFromTransactionData(transactionId: string, outputIndex: number): string {
    return transactionId + uInt16NumberToLittleEndianHex(outputIndex)
}

function uInt16NumberToLittleEndianHex(num: number) {
    const littleEndianNumber = ((num & 0xff) << 8) | ((num >> 8) & 0xff)
    const hex = ('0000' + littleEndianNumber.toString(16).toUpperCase()).slice(-4)
    return hex
}
