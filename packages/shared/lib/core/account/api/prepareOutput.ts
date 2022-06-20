import { getAccount } from '@core/profile-manager'
import { OutputTypes } from '@iota/types'
import { OutputOptions, TransactionOptions } from '@iota/wallet'

export async function prepareOutput(
    accountId: string,
    options?: OutputOptions,
    transactionOptions?: TransactionOptions
): Promise<OutputTypes> {
    return (await getAccount(Number(accountId)))?.prepareOutput(options, transactionOptions)
}
