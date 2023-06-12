import type { TokenMetadata } from '@core/wallet'
import { MAX_SUPPORTED_ERC20_DECIMALS } from '@core/wallet/constants'

export function isValidErc20Token(tokenMetadata: TokenMetadata): boolean {
    return tokenMetadata.decimals <= MAX_SUPPORTED_ERC20_DECIMALS
}
