import { IAsset } from './asset.interface'

export interface IAssetState {
    baseCoin: IAsset
    nativeTokens: IAsset[]
}
