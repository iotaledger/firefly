import { IVestingOutput } from './vesting-output.interface'

export interface IVestingOverview {
    accumulatedPayout: number
    remainingPayout: number
    totalRewards: number
    lockedOutputs: IVestingOutput[]
    payoutAmount: number
}
