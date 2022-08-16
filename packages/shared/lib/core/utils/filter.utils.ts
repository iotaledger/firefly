import { OutputData } from '@iota/wallet/types/output'
import { IBasicOutput } from '@iota/types'

export function filterBasicOutput(outputData: OutputData): boolean {
    const output = outputData?.output as IBasicOutput
    return output?.unlockConditions?.length === 1
}
