import { NetworkProtocol } from './network'

export type TokenMetadata = {
    name: string
    tickerSymbol?: string
    unit?: string
    decimals?: number
    subunit?: string
    useMetricPrefix?: boolean
    primaryColor?: string
    secondaryColor?: string
}

export enum TickerSymbol {
    IOTA = 'MIOTA',
    Assembly = 'ASMB',
    Shimmer = 'SMR',
}

export enum TokenUnit {
    IOTA = 'i',
    Assembly = 'ASMB',
    Shimmer = 'SMR',
}

export enum SubUnit {
    Shimmer = 'glow',
}

export type Asset = {
    meta: TokenMetadata
    // balance: string
    rawBalance: number
    fiatPrice?: string
    fiatBalance?: string
}

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
