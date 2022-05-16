import { ITokenMetadata } from '../interfaces'

export function formatPreciseTokenAmount(amount: number, tokenMetadata: ITokenMetadata): string {
    if (tokenMetadata.useMetricPrefix) {
        return amount + ' ' + tokenMetadata.unit
    } else {
        return amount + ' ' + tokenMetadata.subunit
    }
}
