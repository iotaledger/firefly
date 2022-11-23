import type { NativeTokenAmount } from '@core/token'

export interface ITransferAllowanceMetadata {
    ethereumAddress: string
    forceOpenAccount: boolean
    baseTokenAmount: string
    nativeTokens: NativeTokenAmount[]
}
