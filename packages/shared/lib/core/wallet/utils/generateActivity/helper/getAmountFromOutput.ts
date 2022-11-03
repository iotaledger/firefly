import { Output } from '@core/wallet/types'

export function getAmountFromOutput(output: Output): number {
    return Number(output?.amount ?? 0)
}
