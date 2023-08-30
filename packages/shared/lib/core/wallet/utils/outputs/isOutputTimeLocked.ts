import { getTimelockDateFromOutput } from '@core/wallet'
import { CommonOutput, OutputData, OutputType } from '@iota/sdk/out/types'

export function isOutputTimeLocked(outputData: OutputData): boolean {
    const output = outputData.output
    if (output.type !== OutputType.Treasury) {
        const unlockTime = getTimelockDateFromOutput(output as CommonOutput)
        return unlockTime !== undefined && unlockTime.getTime() > Date.now()
    }
    return false
}
