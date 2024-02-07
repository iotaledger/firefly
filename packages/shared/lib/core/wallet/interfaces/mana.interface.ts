import { TokenStandard } from '../enums'

export interface IMana {
    standard: TokenStandard.Mana
    name: string
    tickerSymbol?: string
    unit: string
    subunit?: string | null
    decimals: number
    useMetricPrefix?: boolean
}
