import type { TokenMetadata } from '@core/wallet'
import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants'

export function isValidIrc30Token(tokenMetadata: TokenMetadata): boolean {
    return tokenMetadata.decimals <= MAX_SUPPORTED_DECIMALS
}
