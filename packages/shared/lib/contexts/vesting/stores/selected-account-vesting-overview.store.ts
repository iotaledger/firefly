import { isOutputTimeLocked } from '@core/wallet'
import { derived, Readable } from 'svelte/store'
import { IVestingOverview } from '../interfaces'
import { getSelectedAccountTotalVestingRewards } from '../utils'
import { selectedAccountVestingOutputs } from './'

export const selectedAccountVestingOverview: Readable<IVestingOverview> = derived(
    selectedAccountVestingOutputs,
    ($selectedAccountVestingOutputs) => {
        const totalRewards = getSelectedAccountTotalVestingRewards()

        const allVestingOutputs = $selectedAccountVestingOutputs.flatMap(({ outputs }) => outputs) ?? []
        const vestingLockedOutputs = allVestingOutputs.filter(isOutputTimeLocked)
        const remainingPayout = vestingLockedOutputs.reduce(
            (acc, output) => acc + parseInt(output.output.amount, 10),
            0
        )

        const accumulatedPayout = totalRewards - remainingPayout

        return {
            accumulatedPayout,
            remainingPayout,
            totalRewards,
        }
    }
)
