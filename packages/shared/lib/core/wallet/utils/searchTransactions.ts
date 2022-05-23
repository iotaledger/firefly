import { sendAddressFromTransactionPayload, receiverAddressesFromTransactionPayload } from 'shared/lib/wallet'
import { Transaction } from 'shared/lib/typings/message'
import { unitToValue, isValueInUnitRange } from 'shared/lib/utils'
import { formatUnitBestMatch } from 'shared/lib/units'
import { AccountMessage } from '@lib/typings/wallet'

export function searchTransactions(transactions: AccountMessage[], searchTerm: string): AccountMessage[] {
    return transactions.filter((transaction) => {
        const transactionValue = (transaction?.payload as Transaction)?.data?.essence?.data?.value
        return (
            sendAddressFromTransactionPayload(transaction?.payload) === searchTerm ||
            receiverAddressesFromTransactionPayload(transaction?.payload).find((addr) => addr === searchTerm) ||
            transaction?.id.toLowerCase() === searchTerm ||
            (searchTerm[0] === '>' && unitToValue(searchTerm.substring(1)) < transactionValue) ||
            (searchTerm[0] === '<' && unitToValue(searchTerm.substring(1)) > transactionValue) ||
            (searchTerm[1] === 'i' && isValueInUnitRange(transactionValue, searchTerm)) ||
            transactionValue === unitToValue(searchTerm) ||
            formatUnitBestMatch(transactionValue).toString().toLowerCase()?.includes(searchTerm)
        )
    })
}
