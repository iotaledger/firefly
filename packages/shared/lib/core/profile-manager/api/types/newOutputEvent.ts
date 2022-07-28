import { IOutputResponse, ITransactionPayload } from '@iota/types'
import { OutputData } from '@iota/wallet/types/output'

export type NewOutputEvent = {
    output: OutputData
    transaction: ITransactionPayload
    transactionInputs: IOutputResponse[]
}
