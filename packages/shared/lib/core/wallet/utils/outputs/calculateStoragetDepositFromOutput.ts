import type { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_TREASURY } from '../../constants'
import { getStorageDepositFromOutput } from './getStorageDepositFromOutput'

export function calculateStorageDepositFromOutput(output: OutputTypes, rawAmount: number): number {
    if (output && output?.type !== OUTPUT_TYPE_TREASURY) {
        return getStorageDepositFromOutput(output) ?? Number(output.amount) - rawAmount ?? 0
    } else {
        return 0
    }
}
