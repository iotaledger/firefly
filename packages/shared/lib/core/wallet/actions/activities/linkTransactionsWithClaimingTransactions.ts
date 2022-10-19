import { IAccountState } from '@core/account'
import { activeProfileId } from '@core/profile'
import { ActivityDirection, IProcessedTransaction } from '@core/wallet'
import { getDirectionFromTransaction } from '@core/wallet/utils'
import { isOutputAsync } from '@core/wallet/utils/outputs/isOutputAsync'
import { ICommonOutput } from '@iota/types'
import { get } from 'svelte/store'
import { addClaimedActivity, claimedActivities } from '../../stores'

/**
 * It takes a list of transactions and links the transactions that are claiming async transactions
 * @param {IProcessedTransaction[]} transactions - IProcessedTransaction[]
 * @param {IAccountState} account - IAccountState - the account for which we are processing
 * transactions
 * @returns An array of processed transactions
 */
export function linkTransactionsWithClaimingTransactions(
    transactions: IProcessedTransaction[],
    account: IAccountState
): IProcessedTransaction[] {
    const resultingTransactions = []
    const transactionsIncludedAsClaimingTransactions = []

    const claimedAccountActivities = get(claimedActivities)?.[get(activeProfileId)]?.[account.index]
    const sortedTransactions = transactions.sort((t1, t2) => (t1.time > t2.time ? 1 : -1))
    const incomingAsyncTransactions: IProcessedTransaction[] = []
    for (const transaction of sortedTransactions) {
        const isClaimingTransaction = transactionsIncludedAsClaimingTransactions.includes(transaction.transactionId)
        const isIncomingAsyncTransaction =
            transaction.outputs.some((_output) => isOutputAsync(_output.output as ICommonOutput)) &&
            getDirectionFromTransaction(transaction, account.depositAddress) === ActivityDirection.Incoming

        if (isClaimingTransaction) {
            continue
        } else if (isIncomingAsyncTransaction) {
            // If we have the corresponding claiming transaction cached in local storage, we get that data and update the async transaction
            const claimedActivity = claimedAccountActivities?.[transaction.transactionId]
            if (claimedActivity && claimedActivity.claimingTransactionId === transaction.transactionId) {
                const claimingData = {
                    claimedDate: new Date(claimedActivity.claimedTimestamp),
                    claimingTransactionId: claimedActivity.claimingTransactionId,
                }
                transaction.claimingData = claimingData
                transactionsIncludedAsClaimingTransactions.push(claimingData.claimingTransactionId)
            } else {
                // Else we store the async transaction in a list, which we later use to check if a transaction is the claiming transaction for another one
                incomingAsyncTransactions.push(transaction)
            }
            resultingTransactions.push(transaction)
        } else if (transaction.isIncoming) {
            // Incoming transactions can never be claiming transactions
            // Even though we specify self transactions as "Direction.In", "incoming" flag is false for them, which is important here,
            // as self transactions are most of the time claiming transactions
            resultingTransactions.push(transaction)
        } else {
            // For 'normal' transactions we search through the async transactions to check if one is the claiming transaction from the other one
            // If we find a match, we update the async transaction and ignore the current one
            const claimedTransaction = searchClaimedTransactionInIncomingAsyncTransactions(
                incomingAsyncTransactions,
                transaction
            )
            if (claimedTransaction) {
                claimedTransaction.claimingData = {
                    claimedDate: transaction.time,
                    claimingTransactionId: transaction.transactionId,
                }

                addClaimedActivity(account.index, claimedTransaction.transactionId, {
                    id: claimedTransaction.transactionId,
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

function searchClaimedTransactionInIncomingAsyncTransactions(
    allAsyncTransaction: IProcessedTransaction[],
    transaction: IProcessedTransaction
): IProcessedTransaction {
    return allAsyncTransaction.find((candidate) =>
        transaction.transactionInputs?.some((input) => input.transactionId === candidate.transactionId)
    )
}
