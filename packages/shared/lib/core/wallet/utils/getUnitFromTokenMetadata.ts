import { IBaseToken, IIrc30Metadata } from '../interfaces'
import { TokenMetadata } from '../types'
import { isBaseToken } from './isBaseToken'

export function getUnitFromTokenMetadata(tokenMetadata: TokenMetadata): string {
    if (isBaseToken(tokenMetadata)) {
        const baseToken = tokenMetadata as IBaseToken
        return baseToken?.useMetricPrefix ? baseToken?.unit : baseToken?.subunit
    } else {
        const irc30Metadata = tokenMetadata as IIrc30Metadata
        return irc30Metadata?.symbol
    }
}
