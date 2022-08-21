import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet/constants'

export function getFoundryOutputFromTransaction(outputs: OutputTypes[]): { output: OutputTypes; outputIndex: number } {
    const outputIndex = outputs.findIndex((output) => output.type === OUTPUT_TYPE_FOUNDRY)
    return { output: outputs[outputIndex], outputIndex: outputIndex }
}
