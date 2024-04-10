import { IWalletState } from '@core/wallet/interfaces'
import { activeProfileId } from '@core/profile'
import { ActivityDirection, IClaimedActivities, IProcessedTransaction } from '@core/wallet'
import { isOutputAsync } from '@core/wallet/utils/outputs/isOutputAsync'
import { get } from 'svelte/store'
import { addClaimedActivity, claimedActivities } from '../../stores'

/**
 * It takes a list of transactions and links the transactions that are claiming async transactions
 * @param {IProcessedTransaction[]} transactions - IProcessedTransaction[]
 * @param {IWalletState} wallet - IWalletState - the wallet for which we are processing
 * transactions
 * @returns An array of processed transactions
 */
export function linkTransactionsWithClaimingTransactions(
    transactions: IProcessedTransaction[],
    wallet: IWalletState
): IProcessedTransaction[] {
    const resultingTransactions = []
    const transactionsIncludedAsClaimingTransactions: string[] = []

    const claimedWalletActivities: { [transactionId: string]: IClaimedActivities } =
        get(claimedActivities)?.[get(activeProfileId)]?.[wallet.id]

    const sortedTransactions = transactions.sort((t1, t2) => (t1.time > t2.time ? 1 : -1))
    const incomingAsyncTransactions: IProcessedTransaction[] = []
    for (const transaction of sortedTransactions) {
        const isClaimingTransaction = transactionsIncludedAsClaimingTransactions.includes(transaction?.transactionId)
        const isIncomingAsyncTransaction =
            transaction.outputs.some((_output) => isOutputAsync(_output.output)) &&
            (transaction.direction === ActivityDirection.Incoming ||
                transaction.direction === ActivityDirection.SelfTransaction)
        if (isClaimingTransaction) {
            continue
        } else if (isIncomingAsyncTransaction) {
            // If we have the corresponding claiming transaction cached in local storage, we get that data and update the async transaction
            const claimedActivity = claimedWalletActivities?.[transaction?.transactionId]
            if (claimedActivity) {
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
        } else if (transaction.direction === ActivityDirection.Incoming) {
            // Incoming transactions can never be claiming transactions
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
                    claimingTransactionId: transaction?.transactionId,
                }

                addClaimedActivity(wallet.id, claimedTransaction?.transactionId, {
                    id: claimedTransaction?.transactionId,
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
): IProcessedTransaction | undefined {
    return allAsyncTransaction.find((candidate) =>
        transaction.utxoInputs?.some((input) => input?.transactionId === candidate?.transactionId)
    )
}
