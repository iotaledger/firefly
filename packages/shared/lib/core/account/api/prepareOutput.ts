import { getAccount } from '@core/profile-manager'
import { OutputTypes } from '@iota/types'
import { OutputOptions, TransactionOptions } from '@iota/wallet'

export async function prepareOutput(
    accountIndex: number,
    options?: OutputOptions,
    transactionOptions?: TransactionOptions
): Promise<OutputTypes> {
    return (await getAccount(accountIndex))?.prepareOutput(options, transactionOptions)
}
