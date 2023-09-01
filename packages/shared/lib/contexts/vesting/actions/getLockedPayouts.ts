import { IVestingOutput, IVestingPayout } from '../interfaces'
import { groupOutputsInPayouts } from '../utils'

/**
 * Get all outputs with an active unlock time condition
 * @param outputs The outputs array
 * @returns An array of the outputs that are still locked
 */
export function getLockedPayouts(outputs: IVestingOutput[], payoutAmount: number): IVestingPayout[] {
    const today = new Date()
    const payouts = groupOutputsInPayouts(outputs, payoutAmount)
    const lockedOutputs: IVestingPayout[] = []
    for (const [payoutDate, payout] of payouts) {
        if (payoutDate.getTime() > today.getTime()) {
            lockedOutputs.push(payout)
        }
    }
    return lockedOutputs
}
