import { Readable, derived } from 'svelte/store'
import { INITIAL_VESTING_PAYOUT_PERCENTAGE } from '../constants'
import { VestingOutputStatus } from '../enums'
import { IVestingOverview } from '../interfaces'
import { selectedAccountVestingPayouts } from './'

export const selectedAccountVestingOverview: Readable<IVestingOverview> = derived(
    selectedAccountVestingPayouts,
    ($selectedAccountVestingPayouts) => {
        const accumulatedScheduledPayout =
            $selectedAccountVestingPayouts?.reduce(
                (acc, { amount, status }) => (status === VestingOutputStatus.Unlocked ? acc + amount : acc),
                0
            ) ?? 0
        const remainingPayout =
            $selectedAccountVestingPayouts?.reduce(
                (acc, { amount, status }) => (status === VestingOutputStatus.Locked ? acc + amount : acc),
                0
            ) ?? 0
        // note: we add the initial payout to the total rewards
        const totalRewards =
            ((accumulatedScheduledPayout + remainingPayout) * 100) / (100 - INITIAL_VESTING_PAYOUT_PERCENTAGE)
        return {
            accumulatedPayout: totalRewards - remainingPayout,
            remainingPayout,
            totalRewards,
        }
    }
)
