import { buildFoundryId } from './getFoundryId'
import type { CommonOutput, FoundryOutput, INativeToken, SimpleTokenScheme } from '@iota/wallet/out/types'
import { OutputType } from '@iota/wallet/out/types'

export function getNativeTokenFromOutput(output: CommonOutput): INativeToken | undefined {
    if (output?.type === OutputType.Foundry) {
        const foundryOutput = output as FoundryOutput
        return {
            id: buildFoundryId(output as FoundryOutput),
            amount: (foundryOutput.tokenScheme as SimpleTokenScheme).mintedTokens,
        }
    }

    return output?.nativeTokens?.[0]
}
