import { OUTPUT_TYPE_TREASURY, Output, getTimelockDateFromOutput } from '@core/wallet'
import { OutputData } from '@iota/wallet'

export function isOutputTimeLocked(outputData: OutputData): boolean {
    const output = outputData.output
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        const unlockTime = getTimelockDateFromOutput(output as Output)
        return unlockTime !== undefined && unlockTime.getTime() > Date.now()
    }
    return false
}
