import { InclusionState } from '@core/wallet/enums'
import { IOutputResponse, IUTXOInput } from '@iota/types'
import { IWrappedOutput } from './wrapped-output.interface'

export interface IProcessedTransaction {
    outputs: IWrappedOutput[]
    transactionId: string
    isIncoming: boolean
    time: Date
    inclusionState: InclusionState
    transactionInputs: IUTXOInput[]
    detailedTransactionInputs: IOutputResponse[]
    claimingData?: IClaimData
}

interface IClaimData {
    claimedDate: Date
    claimingTransactionId: string
}
