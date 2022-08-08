import type { INativeToken, OutputTypes } from '@iota/types'
import { buildFoundryId } from './getFoundryId'

export function getNativeTokenFromOutput(output: OutputTypes): INativeToken {
    if (output?.type === 5) {
        return { id: buildFoundryId(output), amount: output.tokenScheme.mintedTokens }
    }
    if (output?.type !== 2) {
        return output?.nativeTokens?.[0]
    } else {
        return undefined
    }
}
