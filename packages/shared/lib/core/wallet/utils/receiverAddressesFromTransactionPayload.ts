import { ITransactionPayload } from '@iota/types'

/**
 * Get the receiver addresses from a transaction payload.
 */
export function receiverAddressesFromTransactionPayload(payload: ITransactionPayload): string[] {
    return payload?.essence?.outputs?.map((output) => output.type) ?? []
}
