import { TokenStandard } from '../enums'

export interface IBaseTokenMetadata {
    standard: TokenStandard.BaseCoin
    name: string
    tickerSymbol?: string
    unit: string
    decimals: number
    subunit?: string | null
    useMetricPrefix?: boolean
}
