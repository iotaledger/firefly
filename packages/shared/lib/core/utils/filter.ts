import type { BasicOutput, OutputData } from '@iota/wallet/out/types'
import { OutputType } from '@iota/wallet/out/types'

export function filterBasicOutput(outputData: OutputData): boolean {
    return outputData?.output?.getType() === OutputType.Basic
}

export function filterShimmerClaimingOutputs(outputData: OutputData): boolean {
    const output = outputData?.output as BasicOutput

    const isBasicOutput = filterBasicOutput(outputData)
    const hasOneUnlockCondition = output?.getUnlockConditions()?.length === 1
    const hasNoNativeTokens = !output?.getNativeTokens() || output?.getNativeTokens()?.length === 0

    return isBasicOutput && hasOneUnlockCondition && hasNoNativeTokens
}
