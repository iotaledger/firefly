import type { INativeToken, OutputTypes } from '@iota/types'

export function getNativeTokenFromOutput(output: OutputTypes): INativeToken {
    if (output?.type === 5) {
        // TOOD: add here the foundry id
        return { id: 'outputId', amount: output.amount }
    }
    if (output?.type !== 2) {
        return output?.nativeTokens?.[0]
    } else {
        return undefined
    }
}
