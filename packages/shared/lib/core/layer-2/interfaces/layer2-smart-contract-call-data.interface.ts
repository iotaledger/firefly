import { ILayer2AssetAllowance } from './layer2-asset-allowance.interface'

export interface ILayer2SmartContractCallData extends ILayer2AssetAllowance {
    senderContract: string
    targetContract: string
    contractFunction: string
    gasFee: string
}
