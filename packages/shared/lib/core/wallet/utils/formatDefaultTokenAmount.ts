import { ITokenMetadata } from '../interfaces'

export function formatDefaultTokenAmount(amount: number, tokenMetadata: ITokenMetadata): string {
    return amount / 10 ** tokenMetadata?.decimals + ' ' + tokenMetadata.unit
}
