import { buildFoundryId } from './getFoundryId'
import { CommonOutput, FoundryOutput, INativeToken, OutputType, SimpleTokenScheme } from '@iota/wallet'

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
