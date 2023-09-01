import {
    INITIAL_VESTING_PAYOUT_PERCENTAGE,
    INVESTOR_VESTING_DURATION,
    PAYOUTS_IN_1_YEAR,
    STAKER_VESTING_DURATION,
} from '../constants'
import { getSelectedAccountVestingAmountPerPayout } from './'
import { isSelectedAccountVestingStaker } from './isSelectedAccountVestingStaker'

// TODO: Enhance vesting logic to consider hybrid wallet staker/investor
export function getSelectedAccountTotalVestingRewards(): number {
    const amountPerPayout = getSelectedAccountVestingAmountPerPayout()
    const vestingDuration = isSelectedAccountVestingStaker() ? STAKER_VESTING_DURATION : INVESTOR_VESTING_DURATION
    const vestingRewards = amountPerPayout * (PAYOUTS_IN_1_YEAR * vestingDuration)
    // note: we add the initial payout to the total rewards
    return (vestingRewards * 100) / (100 - INITIAL_VESTING_PAYOUT_PERCENTAGE)
}
