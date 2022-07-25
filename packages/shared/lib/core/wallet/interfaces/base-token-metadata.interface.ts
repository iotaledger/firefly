export interface IBaseTokenMetadata {
    standard: 'BASE'
    name: string
    tickerSymbol?: string
    unit: string
    decimals: number
    subunit?: string | null
    useMetricPrefix?: boolean
}
