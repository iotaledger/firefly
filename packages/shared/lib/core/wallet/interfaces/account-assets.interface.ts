import { IAsset } from './asset.interface'

export type AccountAssets = {
    // [networkId: string] | [chainId: number]
    [id: number | string]: IAccountAssetsPerNetwork
}

export interface IAccountAssetsPerNetwork {
    baseCoin: IAsset | undefined
    nativeTokens: IAsset[]
}
