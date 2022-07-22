import { TokenVerificationStatus } from '../enums'

export interface ITokenMetadata {
    name: string
    tickerSymbol?: string
    unit?: string
    decimals?: number
    subunit?: string | null
    useMetricPrefix?: boolean
    primaryColor?: string
    secondaryColor?: string
    url?: string
    verification: TokenVerificationStatus
}
