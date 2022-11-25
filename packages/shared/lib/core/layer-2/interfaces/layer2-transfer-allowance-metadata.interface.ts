import { ILayer2SmartContractCallData } from '@core/layer-2/interfaces/layer2-smart-contract-call-data.interface'

export interface ILayer2TransferAllowanceMetadata extends ILayer2SmartContractCallData {
    ethereumAddress: string
    forceOpenAccount: boolean
}
