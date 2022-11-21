import type { NativeTokenAmount } from '@core/token'

export interface ILayer2SmartContractMetadata {
    senderContract: string
    targetContract: string
    contractFunction: string
    gasBudget: bigInt.BigInteger
}

export interface ITransferAllowanceMetadata {
    ethereumAddress: string
    forceOpenAccount: boolean
    baseTokenAmount: string
    nativeTokens: NativeTokenAmount[]
}
