import { NativeTokenAmount } from '@core/token'

export interface ILayer2SmartContractCallData {
    senderContract: string
    targetContract: string
    contractFunction: string
    gasBudget: string
    baseTokenAmount: string
    nativeTokens: NativeTokenAmount[]
}
