import { getTimelockDateFromOutput } from '@core/wallet'
import { CommonOutput, OutputData } from '@iota/sdk/out/types'

export function isOutputTimeLocked(outputData: OutputData): boolean {
    const output = outputData.output
    const unlockTime = getTimelockDateFromOutput(output as CommonOutput)

    return unlockTime !== undefined && unlockTime.getTime() > Date.now()
}
