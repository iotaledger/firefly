export interface IBaseToken {
    name: string
    tickerSymbol?: string
    unit: string
    subunit?: string | null
    decimals: number
    useMetricPrefix?: boolean
}
