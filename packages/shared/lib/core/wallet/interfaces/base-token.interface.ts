import { TokenStandard } from '../enums'

export interface IBaseToken {
    standard: TokenStandard.BaseToken
    name: string
    tickerSymbol?: string
    unit: string
    subunit?: string | null
    decimals: number
    useMetricPrefix?: boolean
}
