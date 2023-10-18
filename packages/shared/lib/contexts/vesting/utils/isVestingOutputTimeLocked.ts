import { IVestingOutput } from '../interfaces'

export function isVestingOutputTimeLocked(output: IVestingOutput): boolean {
    const unlockTime = output.unlockTime
    return unlockTime !== undefined && unlockTime.getTime() > Date.now()
}
