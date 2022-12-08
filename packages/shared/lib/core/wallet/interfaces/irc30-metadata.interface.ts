import { TokenStandard } from '@core/wallet/enums'

export interface IIrc30Metadata {
    standard: TokenStandard.Irc30
    name: string
    description?: string
    symbol: string
    decimals: number
    url?: string
    logo?: string
    logoUrl?: string
}
