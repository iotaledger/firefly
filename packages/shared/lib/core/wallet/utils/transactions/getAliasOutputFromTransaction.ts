import { OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getAliasOutputFromTransaction(outputs: IWrappedOutput[]): IWrappedOutput {
    const output = outputs.find((output) => output.output.type === OUTPUT_TYPE_ALIAS)
    return output
}
