import { OutputData } from '@iota/wallet/types/output'

export function sumTotalFromOutputs(outputs: OutputData[]): number {
    return outputs?.reduce((total: number, curr: OutputData) => (total += Number(curr?.output?.amount)), 0)
}
