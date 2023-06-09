import { TokenMetadata, TokenStandard } from '@core/wallet'
import { isValidErc20Token, isValidIrc30Token } from './'

export function isValidToken(tokenMetadata: TokenMetadata): boolean {
    switch (tokenMetadata.standard) {
        case TokenStandard.Irc30:
            return isValidIrc30Token(tokenMetadata)
        case TokenStandard.Erc20:
            return isValidErc20Token(tokenMetadata)
        case TokenStandard.BaseToken:
            return true
        default:
            return false
    }
}
