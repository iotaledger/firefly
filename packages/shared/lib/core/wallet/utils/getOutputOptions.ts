import type { OutputOptions } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'

export function getOutputOptions(
    expirationDate: Date,
    recipientAddress: string,
    rawAmount: number,
    metadata: string,
    tag: string
): OutputOptions {
    const unixTime = expirationDate ? Math.round(expirationDate.getTime() / MILLISECONDS_PER_SECOND) : undefined
    return {
        recipientAddress,
        amount: String(rawAmount),
        features: {
            ...(metadata && { metadata }),
            ...(tag && { tag }),
        },
        unlocks: {
            ...(unixTime && { expiration: { unixTime: unixTime.toString() } }),
        },
    }
}
