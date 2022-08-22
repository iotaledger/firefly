import type { OutputTypes } from '@iota/types'
import { InclusionState } from '@core/wallet/enums'
import { IOutputResponse, IUTXOInput } from '@iota/types'

export interface IProcessedTransaction {
    outputs: OutputTypes[]
    transactionId: string
    isIncoming: boolean
    time: Date
    inclusionState: InclusionState
    transactionInputs: IUTXOInput[]
    detailedTransactionInputs: IOutputResponse[]
}
