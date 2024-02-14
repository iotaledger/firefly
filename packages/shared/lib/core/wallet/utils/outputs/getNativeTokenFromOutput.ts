import { buildFoundryId } from './getFoundryId'
import type { CommonOutput, FoundryOutput, NativeToken, SimpleTokenScheme } from '@iota/sdk/out/types'
import { NativeTokenFeature, OutputType } from '@iota/sdk/out/types'

export function getNativeTokenFromOutput(output: CommonOutput): NativeToken | undefined {
    if (output?.type === OutputType.Foundry) {
        const foundryOutput = output as FoundryOutput
        return {
            id: buildFoundryId(foundryOutput),
            amount: (foundryOutput.tokenScheme as SimpleTokenScheme).mintedTokens,
        }
    }

    if (output.features) {
        for (const feature of output.features) {
            if (feature instanceof NativeTokenFeature) return feature.asNativeToken()
        }
    }
    return undefined
}
