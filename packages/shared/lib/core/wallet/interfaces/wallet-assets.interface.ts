import { IAsset } from './asset.interface'

export type WalletAssets = {
    // [networkId: string] | [chainId: number]
    [id: number | string]: IWalletAssetsPerNetwork
}

export interface IWalletAssetsPerNetwork {
    baseCoin: IAsset | undefined
    nativeTokens: IAsset[]
}
