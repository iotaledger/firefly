import { INVESTOR_VESTING_DURATION, STAKER_VESTING_DURATION, VESTING_PAYOUTS_IN_1_YEAR } from '../constants'
import { isSelectedAccountVestingStaker } from '.'

/**
 * The amount of payouts the address will have from the start to end
 * @returns The amount of payouts
 */
export function getTotalVestingPayouts(): number {
    const vestingDuration = isSelectedAccountVestingStaker() ? STAKER_VESTING_DURATION : INVESTOR_VESTING_DURATION
    return VESTING_PAYOUTS_IN_1_YEAR * vestingDuration
}
