import { ILayer2Allowance } from '@core/layer-2/interfaces'

export interface ILayer2SmartContractCallData extends ILayer2Allowance {
    senderContract: string
    targetContract: string
    contractFunction: string
    gasBudget: string
}
