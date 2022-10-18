import type { ITokenMetadata } from '@core/wallet'
import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants'

export function isValidIrc30(tokenMetadata: ITokenMetadata): boolean {
    return tokenMetadata.decimals <= MAX_SUPPORTED_DECIMALS
}
