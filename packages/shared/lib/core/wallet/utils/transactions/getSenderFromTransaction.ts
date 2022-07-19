import { Subject } from '@core/wallet/types'
import { OutputTypes } from '@iota/types'
import { Transaction } from '@iota/wallet'
import { getSenderFromOutput } from '../outputs'
import { getSenderFromTransactionInputs } from './getSenderFromTransactionInputs'

export function getSenderFromTransaction(
    transaction: Transaction,
    output: OutputTypes,
    accountAddress: string
): Subject {
    if (!transaction?.incoming) {
        return { type: 'address', address: accountAddress }
    } else if (transaction?.incoming) {
        return getSenderFromTransactionInputs(transaction.payload.essence.inputs) ?? getSenderFromOutput(output)
    } else {
        return undefined
    }
}
