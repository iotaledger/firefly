import { derived, Readable } from 'svelte/store'
import { selectedWalletVestingOutputs } from '.'
import { IVestingOutput } from '../interfaces'
import { isVestingOutputTimeLocked } from '../utils'

export const selectedWalletVestingUnclaimedFunds: Readable<number> = derived(
    selectedWalletVestingOutputs,
    ($selectedWalletVestingOutputs) => {
        const allVestingOutputs = $selectedWalletVestingOutputs.flatMap(({ outputs }) => outputs) ?? []
        const unclaimedOutputs = allVestingOutputs.filter(
            (output) => !isVestingOutputTimeLocked(output) && !output.isSpent
        )
        return unclaimedOutputs.reduce(_sumAllPayouts, 0)
    }
)

const _sumAllPayouts = (acc: number, output: IVestingOutput): number => acc + output.amount
