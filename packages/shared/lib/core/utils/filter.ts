import type { BasicOutput, OutputData } from '@iota/sdk/out/types'
import { OutputType } from '@iota/sdk/out/types'

export function filterBasicOutput(outputData: OutputData): boolean {
    return outputData?.output?.type === OutputType.Basic
}

export function filterShimmerClaimingOutputs(outputData: OutputData): boolean {
    const output = outputData?.output as BasicOutput

    const isBasicOutput = filterBasicOutput(outputData)
    const hasOneUnlockCondition = output?.unlockConditions?.length === 1
    const hasNoNativeTokens = !output?.nativeTokens || output?.nativeTokens?.length === 0

    return isBasicOutput && hasOneUnlockCondition && hasNoNativeTokens
}
