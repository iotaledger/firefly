import { TokenStandard } from '../enums'
import { TokenMetadata } from '../types'

export function isBaseToken(tokenMetadata: TokenMetadata): boolean {
    return tokenMetadata?.standard === TokenStandard.BaseCoin
}
