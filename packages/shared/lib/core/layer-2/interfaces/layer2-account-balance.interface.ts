export interface ILayer2AccountBalance {
    [chainId: number]: {
        [tokenId: string]: number
    }
}
