import { NativeTokenAmount } from '@core/token'

export interface ILayer2AssetAllowance {
    baseTokenAmount: string
    nativeTokens: NativeTokenAmount[]
    nfts: string[]
}
