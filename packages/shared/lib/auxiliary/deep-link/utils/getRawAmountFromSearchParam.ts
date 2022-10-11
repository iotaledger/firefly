import { AmountNotAnIntegerError, SendOperationParameter } from '@auxiliary/deep-link'

export function getRawAmountFromSearchParam(searchParams: URLSearchParams): string {
    let rawAmount = searchParams.get(SendOperationParameter.Amount)
    const amount = Number(rawAmount)
    if (!Number.isInteger(amount)) {
        throw new AmountNotAnIntegerError(rawAmount)
    }
    if (amount < 0) {
        rawAmount = Math.abs(amount).toString()
    }
    return rawAmount
}
