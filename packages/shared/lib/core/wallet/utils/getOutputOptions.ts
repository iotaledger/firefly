import type { OutputOptions } from '@iota/wallet'
import { convertDateToUnixTimestamp } from '@core/utils'

export function getOutputOptions(
    expirationDate: Date,
    recipientAddress: string,
    rawAmount: number,
    metadata: string,
    tag: string
): OutputOptions {
    const unixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    return {
        recipientAddress,
        amount: String(rawAmount),
        features: {
            ...(metadata && { metadata }),
            ...(tag && { tag }),
        },
        unlocks: {
            ...(unixTime && { expirationUnixTime: unixTime }),
        },
    }
}
