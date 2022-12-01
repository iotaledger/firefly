import { ActivityDirection, InclusionState } from '@core/wallet/enums'
import { IOutputResponse, IUTXOInput } from '@iota/types'
import { IWrappedOutput } from './wrapped-output.interface'

export interface IProcessedTransaction {
    outputs: IWrappedOutput[]
    transactionId: string
    direction: ActivityDirection
    time: Date
    inclusionState: InclusionState
    transactionInputs: IUTXOInput[]
    detailedTransactionInputs: IOutputResponse[]
    claimingData?: IClaimData
}

export interface IClaimData {
    claimedDate: Date
    claimingTransactionId: string
}
