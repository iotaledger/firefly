import { ActivityDirection, InclusionState } from '@core/wallet/enums'
import { IWrappedOutput } from './wrapped-output.interface'
import { UTXOInput } from '@iota/wallet'

export interface IProcessedTransaction {
    outputs: IWrappedOutput[]
    transactionId: string
    direction: ActivityDirection
    time: Date
    inclusionState: InclusionState
    utxoInputs: UTXOInput[]
    wrappedInputs: IWrappedOutput[]
    claimingData?: IClaimData
}

export interface IClaimData {
    claimedDate: Date
    claimingTransactionId: string
}
