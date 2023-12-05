import { OutputData } from '@iota/sdk/out/types'

// TODO(2.0) Fix all usages
export function sumTotalFromOutputs(outputs: OutputData[]): number {
    return outputs?.reduce((total: number, outputData: OutputData) => (total += Number(outputData?.output?.amount)), 0)
}
