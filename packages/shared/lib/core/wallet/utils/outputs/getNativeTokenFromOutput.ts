import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet/constants'
import { Output } from '@core/wallet/types'
import type { INativeToken } from '@iota/types'
import { buildFoundryId } from './getFoundryId'

export function getNativeTokenFromOutput(output: Output): INativeToken {
    if (output?.type === OUTPUT_TYPE_FOUNDRY) {
        return { id: buildFoundryId(output), amount: output.tokenScheme.mintedTokens }
    }
    return output?.nativeTokens?.[0]
}
