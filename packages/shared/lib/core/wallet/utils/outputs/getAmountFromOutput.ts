import { OutputTypes } from '@iota/types'

export function getAmountFromOutput(output: OutputTypes): number {
    return Number(output?.amount ?? 0)
}
