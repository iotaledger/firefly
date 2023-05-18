export interface IMintTokenDetails {
    name: string
    totalSupply: number
    circulatingSupply: number
    decimals: number
    symbol: string
    description: string
    url: string
    logoUrl: string
    aliasId: string
}

export interface IEmptyMintNftDetails {
    name?: string
    totalSupply?: number
    circulatingSupply?: number
    decimals?: number
    symbol?: string
    description?: string
    url?: string
    logoUrl?: string
    aliasId?: string
}
