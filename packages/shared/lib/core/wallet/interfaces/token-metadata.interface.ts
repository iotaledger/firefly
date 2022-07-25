export interface ITokenMetadata {
    name: string
    unit: string
    decimals: number
    subunit?: string | null
    useMetricPrefix?: boolean
    url?: string
    logo?: string
    logoUrl?: string
    primaryColor?: string
    secondaryColor?: string
}
