import { isSelectedAccountVestingStaker } from '../utils'
import { INVESTOR_VESTING_DURATION, STAKER_VESTING_DURATION, PAYOUTS_IN_1_YEAR } from '../constants'

/**
 * The amount of payouts the address will have from the start to end
 * @returns The amount of payouts
 */
export function getTotalPayouts(): number {
    const vestingDuration = isSelectedAccountVestingStaker() ? STAKER_VESTING_DURATION : INVESTOR_VESTING_DURATION
    return PAYOUTS_IN_1_YEAR * vestingDuration
}
