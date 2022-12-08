import { ActivityDirection, InclusionState } from '@core/wallet/enums'
import { IUTXOInput } from '@iota/types'
import { IWrappedOutput } from './wrapped-output.interface'

export interface IProcessedTransaction {
    outputs: IWrappedOutput[]
    transactionId: string
    direction: ActivityDirection
    time: Date
    inclusionState: InclusionState
    utxoInputs: IUTXOInput[]
    wrappedInputs: IWrappedOutput[]
    claimingData?: IClaimData
}

export interface IClaimData {
    claimedDate: Date
    claimingTransactionId: string
}
