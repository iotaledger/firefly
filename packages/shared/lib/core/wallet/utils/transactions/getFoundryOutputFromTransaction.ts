import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet/constants'
import { IOutput } from '@core/wallet/interfaces'

export function getFoundryOutputFromTransaction(outputs: IOutput[]): IOutput {
    const output = outputs.find((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
    return output
}
