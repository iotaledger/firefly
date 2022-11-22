export interface ITokenMetadata {
    name: string
    unit: string
    decimals: number
    description?: string
    subunit?: string | null
    tickerSymbol?: string
    useMetricPrefix?: boolean
    url?: string
    logo?: string
    logoUrl?: string
    primaryColor?: string
    secondaryColor?: string
}
