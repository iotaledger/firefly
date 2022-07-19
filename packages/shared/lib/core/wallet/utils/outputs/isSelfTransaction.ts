import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { OutputTypes } from '@iota/types'

export function isSelfTransaction(outputs: OutputTypes[], accountAddress: string): boolean {
    return outputs.length > 1 && outputs.every((output) => accountAddress === getRecipientAddressFromOutput(output))
}
