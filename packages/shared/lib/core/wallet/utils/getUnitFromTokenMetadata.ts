import { TokenStandard } from '../enums'
import { TokenMetadata } from '../types'

export function getUnitFromTokenMetadata(tokenMetadata: TokenMetadata): string {
    const isBaseToken = tokenMetadata?.standard === TokenStandard.BaseToken
    const isMana = tokenMetadata?.standard === TokenStandard.Mana
    return isBaseToken || isMana ? tokenMetadata?.unit : tokenMetadata?.symbol
}
