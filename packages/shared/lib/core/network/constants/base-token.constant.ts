import { TokenMetadata } from '@lib/typings/assets'
import { NetworkProtocol } from '../enums'

export const BASE_TOKEN: Readonly<{ [key in NetworkProtocol]: TokenMetadata }> = {
    [NetworkProtocol.IOTA]: {
        name: 'IOTA',
        tickerSymbol: 'MIOTA',
        unit: 'i',
        decimals: 0,
        subunit: null,
        useMetricPrefix: true,
        primaryColor: '#6E82A4',
    },
    [NetworkProtocol.Shimmer]: {
        name: 'Shimmer',
        tickerSymbol: 'SMR',
        unit: 'SMR',
        decimals: 6,
        subunit: 'glow',
        useMetricPrefix: false,
        primaryColor: '#25DFCA',
    },
}
