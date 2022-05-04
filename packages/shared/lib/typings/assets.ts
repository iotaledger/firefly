export enum Token {
    IOTA = 'IOTA',
    Assembly = 'Assembly',
    Shimmer = 'Shimmer',
}

export type Asset = {
    name: Token | string
    balance: string
    rawBalance: number
    fiatPrice?: string
    fiatBalance?: string
    color?: string
}
