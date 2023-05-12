import { IAsset } from './asset.interface'

export interface IAccountAssets {
    baseCoin: IAsset | undefined
    nativeTokens: IAsset[]
}
