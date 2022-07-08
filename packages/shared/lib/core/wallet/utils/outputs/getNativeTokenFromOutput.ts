import type { INativeToken, OutputTypes } from '@iota/types'

export function getNativeTokenFromOutput(output: OutputTypes): INativeToken {
    if (output?.type !== 2) {
        return output?.nativeTokens?.[0]
    } else {
        return undefined
    }
}
