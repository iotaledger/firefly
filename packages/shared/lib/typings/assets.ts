export enum Token {
    IOTA = 'IOTA',
    Assembly = 'Assembly',
    Shimmer = 'Shimmer',
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
    name: Token | string
    // balance: string
    rawBalance: number
    fiatPrice?: string
    fiatBalance?: string
    color?: string
}

export type BaseToken = {
    name: Token
    tickerSymbol: TickerSymbol
    unit: TokenUnit
    decimals: number
    subunit: SubUnit
    useMetricPrefix: boolean
}
