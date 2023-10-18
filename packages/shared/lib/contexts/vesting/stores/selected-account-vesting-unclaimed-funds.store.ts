import { derived, Readable } from 'svelte/store'
import { selectedAccountVestingOutputs } from '.'
import { IVestingOutput } from '../interfaces'
import { isVestingOutputTimeLocked } from '../utils'

export const selectedAccountVestingUnclaimedFunds: Readable<number> = derived(
    selectedAccountVestingOutputs,
    ($selectedAccountVestingOutputs) => {
        const allVestingOutputs = $selectedAccountVestingOutputs.flatMap(({ outputs }) => outputs) ?? []
        const unclaimedOutputs = allVestingOutputs.filter(
            (output) => !isVestingOutputTimeLocked(output) && !output.isSpent
        )
        return unclaimedOutputs.reduce(_sumAllPayouts, 0)
    }
)

const _sumAllPayouts = (acc: number, output: IVestingOutput): number => acc + output.amount
