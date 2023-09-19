import { Readable, derived } from 'svelte/store'
import { selectedAccountVestingOutputs } from '.'
import { STAKER_VESTING_DURATION, VESTING_PAYOUTS_IN_1_YEAR, VESTING_PAYOUT_SCHEDULE_MILLISECONDS } from '../constants'
import { VestingOutputStatus, VestingType } from '../enums'
import { IVestingPayout } from '../interfaces'
import { getTotalVestingPayouts } from '../utils'

export const selectedAccountVestingPayouts: Readable<IVestingPayout[]> = derived(
    selectedAccountVestingOutputs,
    ($selectedAccountVestingOutputs) => {
        const now = new Date()
        const payouts: IVestingPayout[] = []
        if ($selectedAccountVestingOutputs?.length) {
            // Calculate the total number of vesting payouts
            const numberOfPayouts = getTotalVestingPayouts()
            // Find the latest unlock time among the selected account vesting outputs
            // This is used to calculate the unlock time for each payout
            const lastUnlockTime = new Date(
                Math.max(
                    ...$selectedAccountVestingOutputs.map(({ lastOutput }) => lastOutput?.unlockTime?.getTime() ?? 0)
                )
            )
            if (numberOfPayouts && lastUnlockTime) {
                // Iterate over the number of payouts to calculate the amount and unlock time for each payout
                for (let i = 0; i < numberOfPayouts; i++) {
                    // If the payout is in the staking years, include all vesting outputs
                    // If the payout is in the vesting only years, include only investor vesting outputs
                    let addressSetToCompute = $selectedAccountVestingOutputs
                    if (i >= VESTING_PAYOUTS_IN_1_YEAR * STAKER_VESTING_DURATION) {
                        addressSetToCompute = $selectedAccountVestingOutputs.filter(
                            ({ type }) => type === VestingType.Investor
                        )
                    }

                    // Map each address with its amount
                    const amounts = addressSetToCompute.map((vestingOutputsWithAddress) => ({
                        amount: vestingOutputsWithAddress.lastOutput?.amount || 0,
                        address: vestingOutputsWithAddress.address,
                    }))
                    // Calculate the total amount to be paid out in this iteration
                    const totalAmount = addressSetToCompute.reduce((acc, vestingOutputsWithAddress) => {
                        const outputAmount = vestingOutputsWithAddress.lastOutput?.amount ?? 0
                        return acc + outputAmount
                    }, 0)
                    // Calculate the unlock time for this payout
                    const unlockTime = new Date(
                        lastUnlockTime.getTime() - VESTING_PAYOUT_SCHEDULE_MILLISECONDS * (numberOfPayouts - i - 1)
                    )
                    // Determine the status of the payout based on unlock time
                    const status =
                        unlockTime.getTime() > now.getTime() ? VestingOutputStatus.Locked : VestingOutputStatus.Unlocked
                    // Add the calculated payout to the payouts array
                    payouts.push({
                        amounts,
                        totalAmount,
                        unlockTime,
                        status,
                    })
                }
            }
        }
        return payouts
    }
)
