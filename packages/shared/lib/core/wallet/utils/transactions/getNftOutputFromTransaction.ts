import { OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getNftOutputFromTransaction(outputs: IWrappedOutput[]): IWrappedOutput {
    const output = outputs.find((output) => output.output.type === OUTPUT_TYPE_NFT)
    return output
}
