import { IUTXOInput } from '@iota/types'
import { Transaction } from '@iota/wallet'
import { OutputData } from '@iota/wallet/types/output'

export type NewOutputEvent = {
    output: OutputData
    transaction: Transaction
    transactionInputs: IUTXOInput[]
}
