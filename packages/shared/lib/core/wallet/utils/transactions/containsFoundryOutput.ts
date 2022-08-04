import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet/constants'
import { Transaction } from '@iota/wallet'

export function containsFoundryOutput(transaction: Transaction): boolean {
    const outputs = transaction.payload.essence.outputs
    return outputs.some((output) => output.type === OUTPUT_TYPE_FOUNDRY)
}
