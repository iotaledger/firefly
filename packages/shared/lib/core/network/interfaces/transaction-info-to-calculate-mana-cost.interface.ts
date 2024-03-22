import { PreparedTransaction } from '@iota/sdk/out/types'

export interface ITransactionInfoToCalculateManaCost {
    preparedTransaction?: PreparedTransaction
    preparedTransactionError?: Error
}
