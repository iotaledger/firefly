import { Output } from '@iota/sdk/out/types'

export function getAmountFromOutput(output: Output): number {
    return Number(output?.amount ?? 0)
}
