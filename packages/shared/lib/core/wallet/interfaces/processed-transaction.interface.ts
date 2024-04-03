import { ActivityDirection } from '@core/wallet/enums'
import { IWrappedOutput } from './wrapped-output.interface'
import { InclusionState, UTXOInput } from '@iota/sdk/out/types'

export interface IProcessedTransaction {
    outputs: IWrappedOutput[]
    transactionId: string
    direction: ActivityDirection
    time: Date
    inclusionState: InclusionState
    utxoInputs: UTXOInput[]
    wrappedInputs: IWrappedOutput[]
    claimingData?: IClaimData
    mana: number
}

export interface IClaimData {
    claimedDate: Date
    claimingTransactionId: string
}
