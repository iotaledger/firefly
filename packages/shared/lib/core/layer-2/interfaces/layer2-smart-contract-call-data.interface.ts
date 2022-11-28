import { ILayer2Allowance } from '@core/layer-2/interfaces/layer2-allowance.interface'

export interface ILayer2SmartContractCallData extends ILayer2Allowance {
    senderContract: string
    targetContract: string
    contractFunction: string
    gasBudget: string
}
