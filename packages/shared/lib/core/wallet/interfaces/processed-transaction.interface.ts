import type { ActivityDirection, InclusionState } from '@core/wallet/enums'
import type { IUTXOInput } from '@iota/types'
import type { IWrappedOutput } from './wrapped-output.interface'

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
