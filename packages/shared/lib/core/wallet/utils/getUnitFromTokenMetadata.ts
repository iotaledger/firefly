import { TokenStandard } from '../enums'
import { TokenMetadata } from '../types'

export function getUnitFromTokenMetadata(tokenMetadata: TokenMetadata): string {
    const isBaseToken = tokenMetadata.standard === TokenStandard.BaseCoin
    return isBaseToken ? tokenMetadata?.unit : tokenMetadata?.symbol
}
