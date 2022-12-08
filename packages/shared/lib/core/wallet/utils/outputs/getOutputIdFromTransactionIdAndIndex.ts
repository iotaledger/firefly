import { convertUInt16NumberToLittleEndianHex } from '@core/utils'

/**
 * Returns the outputId from transation id and output index.
 * @param transactionId The id of the transaction.
 * @param outputIndex The index of the output.
 * @returns The output id.
 */
export function getOutputIdFromTransactionIdAndIndex(transactionId: string, outputIndex: number): string {
    return transactionId + convertUInt16NumberToLittleEndianHex(outputIndex)
}
