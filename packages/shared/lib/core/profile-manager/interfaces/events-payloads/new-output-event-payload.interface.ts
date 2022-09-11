import { IOutputResponse, ITransactionPayload } from '@iota/types'
import { OutputData } from '@iota/wallet/types/output'

export interface INewOutputEventPayload {
    output: OutputData
    transaction: ITransactionPayload
    transactionInputs: IOutputResponse[]
}
