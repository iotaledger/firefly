import { PAYOUT_SCHEDULE_MILLISECONDS } from '../constants'
import { VestingOutputStatus } from '../enums'
import { IVestingPayout } from '../interfaces'

/**
 * Get all the unlocked outputs since the begining of the vesting to now
 * @param totalPayouts Amount of payouts
 * @param lockedPayouts All the still locked outputs
 * @param amount Amount that every unlocked payout received
 * @returns An array of the outputs that are unlocked
 */
export function getUnlockedPayouts(
    totalPayouts: number,
    lockedPayouts: IVestingPayout[],
    payoutAmount: number
): IVestingPayout[] {
    const nextPayout = lockedPayouts[0]
    if (!nextPayout) return []
    let nextPayoutDate = new Date(nextPayout.unlockTime).getTime()
    const unlockedPayoutsNum = totalPayouts - lockedPayouts.length
    const unlockedPayouts: IVestingPayout[] = Array.from({ length: unlockedPayoutsNum })
        .map(() => {
            nextPayoutDate -= PAYOUT_SCHEDULE_MILLISECONDS
            return {
                unlockTime: new Date(nextPayoutDate),
                status: VestingOutputStatus.Unlocked,
                amount: payoutAmount,
            }
        })
        .reverse()
    return unlockedPayouts
}
