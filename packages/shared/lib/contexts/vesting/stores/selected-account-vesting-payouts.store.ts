import { Readable, derived } from 'svelte/store'
import { selectedAccountVestingOutputs } from '.'
import { VESTING_PAYOUT_SCHEDULE_MILLISECONDS } from '../constants'
import { VestingOutputStatus } from '../enums'
import { IVestingPayout } from '../interfaces'
import { getTotalVestingPayouts, getVestingAmountPerPayout } from '../utils'

// TODO: consider staker/investor address based, not account based
export const selectedAccountVestingPayouts: Readable<IVestingPayout[]> = derived(
    selectedAccountVestingOutputs,
    ($selectedAccountVestingOutputs) => {
        const now = new Date()
        const payouts: IVestingPayout[] = []
        if ($selectedAccountVestingOutputs?.length) {
            const numberOfPayouts = getTotalVestingPayouts()
            const amountPerPayout = getVestingAmountPerPayout()
            const setOfVestingOutputs = $selectedAccountVestingOutputs?.map(({ outputs }) => outputs)?.[0] ?? []
            const lastUnlockTime = setOfVestingOutputs[setOfVestingOutputs.length - 1]?.unlockTime
            if (lastUnlockTime) {
                for (let i = 0; i < numberOfPayouts; i++) {
                    const unlockTime = new Date(lastUnlockTime.getTime() - VESTING_PAYOUT_SCHEDULE_MILLISECONDS * i)
                    const status =
                        unlockTime.getTime() > now.getTime() ? VestingOutputStatus.Locked : VestingOutputStatus.Unlocked
                    payouts.unshift({
                        amount: amountPerPayout,
                        unlockTime,
                        status,
                    })
                }
            }
        }
        return payouts
    }
)
