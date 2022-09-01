import { IAccountState } from '@core/account'
import { IProcessedTransaction } from '@core/wallet/interfaces'
import { isOutputAsync } from '@core/wallet/utils/outputs/isOutputAsync'
import { get } from 'svelte/store'
import { addClaimedActivity, claimedActivities } from '../../stores'

export function linkTransactionsWithClaimingTransactions(
    transactions: IProcessedTransaction[],
    account: IAccountState
): IProcessedTransaction[] {
    const resultingTransactions = []
    const transactionsIncludedAsClaimingTransactions = []

    const claimedAccountActivities = get(claimedActivities)?.[account.id]
    const sortedTransactions = transactions.sort((t1, t2) => (t1.time > t2.time ? 1 : -1))
    const asyncTransactions = []

    for (const transaction of sortedTransactions) {
        if (transactionsIncludedAsClaimingTransactions.includes(transaction.transactionId)) {
            continue
        } else if (transaction.outputs.some((_output) => isOutputAsync(_output))) {
            const claimedActivity = claimedAccountActivities?.[transaction.transactionId]
            if (claimedActivity && claimedActivity.claimingTransactionId === transaction.transactionId) {
                const claimingData = {
                    claimedDate: new Date(claimedActivity.claimedTimestamp),
                    claimingTransactionId: claimedActivity.transactionId,
                }
                transaction.claimingData = claimingData
                transactionsIncludedAsClaimingTransactions.push(claimingData.claimingTransactionId)
            } else {
                asyncTransactions.push(transaction)
            }
            resultingTransactions.push(transaction)
        } else {
            const claimedTransaction = searchClaimedTransactionInAllTransactions(asyncTransactions, transaction)

            if (claimedTransaction) {
                claimedTransaction.claimingData = {
                    claimedDate: transaction.time,
                    claimingTransactionId: transaction.transactionId,
                }

                addClaimedActivity(account.id, transaction.transactionId, {
                    id: transaction.transactionId,
                    claimedTimestamp: transaction.time.getTime(),
                    claimingTransactionId: transaction.transactionId,
                })
            } else {
                resultingTransactions.push(transaction)
            }
        }
    }

    return resultingTransactions
}

function searchClaimedTransactionInAllTransactions(
    allAsyncTransaction: IProcessedTransaction[],
    transaction: IProcessedTransaction
): IProcessedTransaction {
    // TODO: add as many restrictions for candidates to optimize the time
    return allAsyncTransaction.find((candidate) =>
        transaction.transactionInputs?.some((input) => input.transactionId === candidate.transactionId)
    )
}
