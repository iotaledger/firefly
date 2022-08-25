import { IAccountState } from '@core/account'
import { IProcessedTransaction } from '@core/wallet/interfaces'
import { isOutputAsync } from '@core/wallet/utils/outputs/isOutputAsync'
import { get } from 'svelte/store'
import { addClaimedActivity, claimedActivities } from '../../stores'

export function linkTransactionsAndClaimingTransaction(
    transactions: IProcessedTransaction[],
    account: IAccountState
): IProcessedTransaction[] {
    const resultingTransactions = []
    const transactionsIncludedAsClaimingTransactions = []

    const claimedAccountActivities = get(claimedActivities)?.[account.id]

    for (const transaction of transactions.sort((t1, t2) => (t1.time > t2.time ? 1 : -1))) {
        if (transactionsIncludedAsClaimingTransactions.includes(transaction.transactionId)) {
            continue
        } else if (transaction.outputs.some((_output) => !isOutputAsync(_output))) {
            // TODO: also include condition if it is outgoing
            resultingTransactions.push(transaction)
        } else {
            let claimingData = undefined

            const claimedActivity = claimedAccountActivities?.[transaction.transactionId]
            if (claimedActivity && claimedActivity.claimingTransactionId === transaction.transactionId) {
                claimingData = {
                    claimedDate: new Date(claimedActivity.claimedTimestamp),
                    claimingTransactionId: claimedActivity.transactionId,
                }
            } else {
                const claimingTransaction = searchClaimingTransactionInAllTransactions(transactions, transaction)

                if (claimingTransaction) {
                    claimingData = {
                        claimedDate: claimingTransaction.time,
                        claimingTransactionId: claimingTransaction.transactionId,
                    }

                    addClaimedActivity(account.id, transaction.transactionId, {
                        id: transaction.transactionId,
                        claimedTimestamp: claimingTransaction.time.getTime(),
                        claimingTransactionId: claimingTransaction.transactionId,
                    })
                }
            }
            if (claimingData) {
                transaction.claimingData = claimingData
                transactionsIncludedAsClaimingTransactions.push(claimingData.claimingTransactionId)
            }
            resultingTransactions.push(transaction)
        }
    }

    return resultingTransactions
}

function searchClaimingTransactionInAllTransactions(
    allTransaction: IProcessedTransaction[],
    transaction: IProcessedTransaction
): IProcessedTransaction {
    // TODO: add as many restrictions for candidates to optimize the time
    const candidates = allTransaction.filter((_activity) => _activity.time > transaction.time)

    return candidates.find((candidate) =>
        candidate.transactionInputs?.some((input) => input.transactionId === transaction.transactionId)
    )
}
