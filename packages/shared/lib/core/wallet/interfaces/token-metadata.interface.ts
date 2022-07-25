import { TokenVerificationStatus } from '../enums'

export interface ITokenMetadata {
    name: string
    unit: string
    decimals: number
    subunit?: string | null
    tickerSymbol?: string
    useMetricPrefix?: boolean
    url?: string
    logo?: string
    logoUrl?: string
    primaryColor?: string
    secondaryColor?: string
    url?: string
    verification: TokenVerificationStatus
}
