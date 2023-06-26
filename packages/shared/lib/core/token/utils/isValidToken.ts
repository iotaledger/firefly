import { TokenMetadata, TokenStandard } from '@core/wallet'
import { isValidIrc30Token } from './'

export function isValidToken(tokenMetadata: TokenMetadata): boolean {
    switch (tokenMetadata.standard) {
        case TokenStandard.Irc30:
            return isValidIrc30Token(tokenMetadata)
        case TokenStandard.BaseToken:
            return true
        default:
            return false
    }
}
