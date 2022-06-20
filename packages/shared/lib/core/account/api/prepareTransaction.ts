import { getAccount } from '@core/profile-manager'
import { OutputTypes } from '@iota/types'
import { PreparedTransactionData, TransactionOptions } from '@iota/wallet'

export async function prepareTransaction(
    id: string,
    outputs: OutputTypes[],
    options?: TransactionOptions
): Promise<PreparedTransactionData> {
    return (await getAccount(Number(id)))?.prepareTransaction(outputs, options)
}
