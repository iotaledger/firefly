import { Output } from '@iota/wallet/out/types'

export function getAmountFromOutput(output: Output): number {
    return Number(output?.amount ?? 0)
}
