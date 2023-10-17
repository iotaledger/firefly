import { NetworkId } from '@core/network/enums'
import { IBaseToken } from '@core/wallet/interfaces'
import { TokenStandard } from '@core/wallet/enums'

const DEFAULT_IOTA_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'IOTA',
    tickerSymbol: 'IOTA',
    unit: 'IOTA',
    decimals: 6,
    subunit: 'micro',
    useMetricPrefix: false,
}

const DEFAULT_IOTA_ALPHANET_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'IOTA',
    tickerSymbol: 'IOTA',
    unit: 'IOTA',
    decimals: 6,
    subunit: 'micro',
    useMetricPrefix: false,
}

const DEFAULT_SHIMMER_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
    useMetricPrefix: false,
}

const DEFAULT_TESTNET_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
    useMetricPrefix: false,
}

export const DEFAULT_BASE_TOKEN: Readonly<{ [key in NetworkId]?: IBaseToken }> = {
    [NetworkId.Iota]: DEFAULT_IOTA_BASE_TOKEN,
    [NetworkId.IotaAlphanet]: DEFAULT_IOTA_ALPHANET_BASE_TOKEN,
    [NetworkId.Shimmer]: DEFAULT_SHIMMER_BASE_TOKEN,
    [NetworkId.Testnet]: DEFAULT_TESTNET_BASE_TOKEN,
}
