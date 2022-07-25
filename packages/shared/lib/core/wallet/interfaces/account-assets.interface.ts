import { IAsset } from './asset.interface'

export interface IAccountAssets {
    baseCoin: IAsset
    nativeTokens: IAsset[]
}
