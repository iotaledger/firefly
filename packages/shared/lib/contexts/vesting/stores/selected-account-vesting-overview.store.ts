import { getTimelockDateFromOutput, isOutputTimeLocked } from '@core/wallet'
import { derived, Readable } from 'svelte/store'
import { IVestingOutput, IVestingOverview } from '../interfaces'
import { getAmountPerPayout, getSelectedAccountTotalVestingRewards } from '../utils'
import { selectedAccountVestingOutputs } from './'
import { OutputData, BasicOutput } from '@iota/sdk/out/types'
import { VestingOutputStatus } from '../enums'

export const selectedAccountVestingOverview: Readable<IVestingOverview> = derived(
    selectedAccountVestingOutputs,
    ($selectedAccountVestingOutputs) => {
        const totalRewards = getSelectedAccountTotalVestingRewards()

        const vestingOutputsFiltered = $selectedAccountVestingOutputs.flatMap(({ outputs }) => outputs) ?? []
        const vestingLockedOutputs = vestingOutputsFiltered.filter(isOutputTimeLocked)
        const remainingPayout = vestingLockedOutputs.reduce(sumAllPayouts, 0)
        const accumulatedPayout = totalRewards - remainingPayout
        const lockedOutputs = vestingLockedOutputs.map(mapBasicOutputToVestingOutput).sort(sortVestingOutputs)
        const payoutAmount = getAmountPerPayout($selectedAccountVestingOutputs)

        return {
            accumulatedPayout,
            remainingPayout,
            totalRewards,
            lockedOutputs,
            payoutAmount,
        }
    }
)

const sumAllPayouts = (acc: number, output: OutputData): number => acc + parseInt(output.output.amount, 10)

const mapBasicOutputToVestingOutput = (output: OutputData): IVestingOutput => {
    const basicOutput = output.output as BasicOutput
    const unlockTime = getTimelockDateFromOutput(basicOutput) as Date
    const status = VestingOutputStatus.Locked

    return {
        outputId: output.outputId,
        unlockTime,
        status,
        amount: parseInt(output.output.amount, 10),
    }
}

/**
 * Sort the vesting outputs by their unlock time date
 */
const sortVestingOutputs = (a: IVestingOutput, b: IVestingOutput): number =>
    a.unlockTime.getTime() - b.unlockTime.getTime()
