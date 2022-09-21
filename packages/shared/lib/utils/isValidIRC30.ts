import { ITokenMetadata, MAX_SUPPORTED_DECIMALS } from '@core/wallet'

export function isValidIRC30(tokenMetadata: ITokenMetadata): boolean {
    return tokenMetadata.decimals <= MAX_SUPPORTED_DECIMALS
}
