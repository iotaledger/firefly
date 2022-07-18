import { Subject } from '@core/wallet/types'
import { Transaction } from '@iota/wallet'
import { getSenderFromOutput } from '../outputs'
import { getNonRemainderOutputFromTransaction } from './getNonRemainderOutputFromTransaction'
import { getSenderFromTransactionInputs } from './getSenderFromTransactionInputs'

export function getSenderFromTransaction(transaction: Transaction, accountAddress: string): Subject {
    if (!transaction?.incoming) {
        return { type: 'address', address: accountAddress }
    } else if (transaction?.incoming) {
        return (
            getSenderFromTransactionInputs(transaction.payload.essence.inputs) ??
            getSenderFromOutput(getNonRemainderOutputFromTransaction(transaction, accountAddress).output)
        )
    } else {
        return undefined
    }
}
