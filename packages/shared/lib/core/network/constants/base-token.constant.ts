import { IBaseToken } from '@core/wallet'
import { NetworkId } from '../enums'

const IOTA_BASE_TOKEN: IBaseToken = {
    name: 'IOTA',
    tickerSymbol: 'MIOTA',
    unit: 'i',
    decimals: 0,
    subunit: null,
    useMetricPrefix: true,
}
const SHIMMER_BASE_TOKEN: IBaseToken = {
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
    useMetricPrefix: false,
}

export const BASE_TOKEN: Readonly<{ [key in NetworkId]: IBaseToken }> = {
    [NetworkId.Iota]: IOTA_BASE_TOKEN,
    [NetworkId.Shimmer]: SHIMMER_BASE_TOKEN,
    [NetworkId.Testnet]: SHIMMER_BASE_TOKEN,
    [NetworkId.Custom]: undefined,
}
