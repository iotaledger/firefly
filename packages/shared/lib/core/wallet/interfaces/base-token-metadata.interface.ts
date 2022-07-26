export interface IBaseTokenMetadata {
    standard: 'BASE_COIN'
    name: string
    tickerSymbol?: string
    unit: string
    decimals: number
    subunit?: string | null
    useMetricPrefix?: boolean
}
