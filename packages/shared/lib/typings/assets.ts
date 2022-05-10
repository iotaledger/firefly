import { NetworkProtocol } from '@core/network'

export type TokenMetadata = {
    name: string
    tickerSymbol?: string
    unit?: string
    decimals?: number
    subunit?: string | null
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
