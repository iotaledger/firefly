import { NativeTokenAmount } from '@core/token'

export interface ILayer2AssetAllowance {
    baseTokens: string
    nativeTokens: NativeTokenAmount[]
    nfts: string[]
}
