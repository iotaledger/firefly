import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet/constants'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getFoundryOutputFromTransaction(outputs: IWrappedOutput[]): IWrappedOutput {
    const output = outputs.find((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
    return output
}
