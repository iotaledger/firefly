import { TokenMetadata, TokenStandard } from '@core/wallet'
import { isValidErc20, isValidIrc30 } from './'

export function isValidToken(tokenMetadata: TokenMetadata): boolean {
    switch (tokenMetadata.standard) {
        case TokenStandard.Irc30:
            return isValidIrc30(tokenMetadata)
        case TokenStandard.Erc20:
            return isValidErc20(tokenMetadata)
        default:
            return false
    }
}
