import { buildFoundryId } from './getFoundryId'
import type { CommonOutput, FoundryOutput, INativeToken, SimpleTokenScheme } from '@iota/wallet'
import { OutputType } from '@iota/wallet/out/types'

export function getNativeTokenFromOutput(output: CommonOutput): INativeToken | undefined {
    if (output?.getType() === OutputType.Foundry) {
        const foundryOutput = output as FoundryOutput
        return {
            id: buildFoundryId(output as FoundryOutput),
            amount: (foundryOutput.getTokenScheme() as SimpleTokenScheme).getMintedTokens(),
        }
    }

    return output?.getNativeTokens()?.[0]
}
