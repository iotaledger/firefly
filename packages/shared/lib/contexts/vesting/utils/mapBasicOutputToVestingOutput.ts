import { getTimelockDateFromOutput } from '@core/wallet'
import { BasicOutput, OutputData } from '@iota/sdk/out/types'
import { VestingOutputStatus } from '../enums'
import { IVestingOutput } from '../interfaces'

export function mapBasicOutputToVestingOutput(output: OutputData): IVestingOutput {
    const basicOutput = output.output as BasicOutput
    const unlockTime = getTimelockDateFromOutput(basicOutput) as Date
    const status = VestingOutputStatus.Locked

    return {
        outputId: output.outputId,
        unlockTime,
        status,
        amount: parseInt(output.output.amount),
        isSpent: !!output.metadata.spent,
    }
}
