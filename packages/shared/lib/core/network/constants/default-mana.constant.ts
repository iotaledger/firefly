import { IBaseToken } from '@core/wallet/interfaces'
import { TokenStandard } from '@core/wallet/enums'

export const DEFAULT_MANA: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'MANA',
    tickerSymbol: 'mana',
    unit: 'mana',
    decimals: 6,
    subunit: 'µmana',
    useMetricPrefix: false,
}
