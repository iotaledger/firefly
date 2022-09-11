import { IOutputResponse, ITransactionPayload } from '@iota/types'
import { OutputData } from '@iota/wallet/types/output'

export interface INewOutputEvent {
    output: OutputData
    transaction: ITransactionPayload
    transactionInputs: IOutputResponse[]
}
