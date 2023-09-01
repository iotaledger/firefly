import { VestingOutputStatus } from '../enums'
import { IVestingOutput, IVestingPayout } from '../interfaces'

/**
 * Group a list of vesting outputs by their unlock time dates
 * @param outputs Vesting outputs
 * @param payoutAmount The amount for every payout
 * @returns Vesting outputs grouped
 */
export function groupOutputsInPayouts(outputs: IVestingOutput[], payoutAmount: number): Map<Date, IVestingPayout> {
    const payouts: Map<Date, IVestingPayout> = new Map()
    for (const output of outputs) {
        const payout = payouts.get(output.unlockTime)

        if (payout === undefined || payout?.status === VestingOutputStatus.Unlocked) {
            payouts.set(output.unlockTime, {
                ...output,
                amount: payoutAmount,
            })
        }
    }
    return payouts
}
