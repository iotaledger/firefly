import { OutputData } from '@iota/wallet'

export function sumTotalFromOutputs(outputs: OutputData[]): number {
    return outputs?.reduce((total: number, outputData: OutputData) => (total += Number(outputData?.output?.amount)), 0)
}
