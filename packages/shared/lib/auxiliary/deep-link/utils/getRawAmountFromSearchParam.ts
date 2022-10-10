import { AmountNotANumberError, SendOperationParameter } from '@auxiliary/deep-link'

export function getRawAmountFromSearchParam(searchParams: URLSearchParams): string {
    const rawAmount = searchParams.get(SendOperationParameter.Amount)
    const amount = Number(rawAmount)
    if (!Number.isInteger(amount)) {
        throw new AmountNotANumberError(rawAmount)
    }
    return rawAmount
}
