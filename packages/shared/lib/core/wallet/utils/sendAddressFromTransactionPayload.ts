import { ITransactionPayload } from '@iota/types'

export function sendAddressFromTransactionPayload(payload: ITransactionPayload): string {
    return payload?.essence?.inputs?.find((input) => input.null)
}
