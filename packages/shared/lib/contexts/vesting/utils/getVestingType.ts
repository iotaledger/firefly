import { STAKER_VESTING_DURATION, STARTING_VESTING_YEAR } from '../constants'
import { VestingType } from '../enums'
import { IVestingOutput } from '../interfaces'
import { sortVestingOutputs } from './sortVestingOutputs'

export function getVestingType(outputs: IVestingOutput[]): VestingType | undefined {
    if (!outputs?.length) {
        return
    } else {
        const lastOutput = outputs.sort(sortVestingOutputs)[outputs.length - 1]
        if (!lastOutput || !lastOutput.unlockTime) {
            return
        } else {
            const isStaker = lastOutput.unlockTime.getFullYear() <= STARTING_VESTING_YEAR + STAKER_VESTING_DURATION
            return isStaker ? VestingType.Staker : VestingType.Investor
        }
    }
}
