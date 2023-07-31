import { Output } from '@iota/wallet'

export function getAmountFromOutput(output: Output): number {
    return Number(output?.amount ?? 0)
}
