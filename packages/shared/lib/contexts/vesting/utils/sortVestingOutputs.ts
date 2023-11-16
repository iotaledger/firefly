import { IVestingOutput } from '../interfaces'

export function sortVestingOutputs(outputA: IVestingOutput, outputB: IVestingOutput): number {
    // if there is no unlock time, it means that the output is part of the first payout
    // and we place it at the begining of the list
    if (!outputA?.unlockTime) {
        return -1
    } else {
        return outputA?.unlockTime?.getTime() - (outputB?.unlockTime?.getTime() ?? -1)
    }
}
