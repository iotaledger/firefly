import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet/constants'
import type { INativeToken, IBasicOutput, IAliasOutput, IFoundryOutput, INftOutput } from '@iota/types'
import { buildFoundryId } from './getFoundryId'

export function getNativeTokenFromOutput(
    output: IBasicOutput | IAliasOutput | IFoundryOutput | INftOutput
): INativeToken {
    if (output?.type === OUTPUT_TYPE_FOUNDRY) {
        return { id: buildFoundryId(output), amount: output.tokenScheme.mintedTokens }
    }
    return output?.nativeTokens?.[0]
}
