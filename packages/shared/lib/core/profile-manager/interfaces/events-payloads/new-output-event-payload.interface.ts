import type { IOutputResponse, ITransactionPayload } from '@iota/types'
import type { OutputData } from '@iota/wallet/types/output'

export interface INewOutputEventPayload {
    output: OutputData
    transaction: ITransactionPayload
    transactionInputs: IOutputResponse[]
}
