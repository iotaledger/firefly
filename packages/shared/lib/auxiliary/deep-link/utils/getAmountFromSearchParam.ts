import { AmountNotANumberError, SendOperationParameter } from '@auxiliary/deep-link'
import { ITokenMetadata, parseRawAmount } from '@core/wallet'

export function getAmountFromSearchParam(searchParams: URLSearchParams, tokenMetadata: ITokenMetadata): string {
    let amount: number
    const rawAmount = searchParams.get(SendOperationParameter.Amount)
    if (rawAmount) {
        amount = parseRawAmount(Number(rawAmount), tokenMetadata)
        if (!amount) {
            throw new AmountNotANumberError(rawAmount)
        }
    } else {
        amount = 0
    }
    return String(Math.abs(amount))
}
