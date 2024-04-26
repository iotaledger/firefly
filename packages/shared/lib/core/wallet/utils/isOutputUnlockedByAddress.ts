import { CommonOutput } from '@iota/sdk/out/types'
import { getRecipientAddressFromOutput } from './outputs'

export function isOutputUnlockedByAddress(output: CommonOutput, address: string): boolean {
    const outputAddress = getRecipientAddressFromOutput(output)
    if(!outputAddress) {
        return false
    }
    return outputAddress === address
}
