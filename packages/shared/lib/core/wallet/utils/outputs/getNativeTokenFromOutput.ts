import { buildFoundryId } from './getFoundryId'
import type { CommonOutput, FoundryOutput, INativeToken, SimpleTokenScheme } from '@iota/sdk/out/types'
import { OutputType } from '@iota/sdk/out/types'

export async function getNativeTokenFromOutput(output: CommonOutput): Promise<INativeToken | undefined> {
    if (output?.type === OutputType.Foundry) {
        const foundryOutput = output as FoundryOutput
        return {
            id: await buildFoundryId(foundryOutput),
            amount: (foundryOutput.tokenScheme as SimpleTokenScheme).mintedTokens,
        }
    }

    return output?.getNativeToken()
}
