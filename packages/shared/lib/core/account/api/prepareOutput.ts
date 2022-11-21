import { getAccount } from '@core/profile-manager'
import { Output } from '@core/wallet'
import { OutputOptions, TransactionOptions } from '@iota/wallet'

export async function prepareOutput(
    accountIndex: number,
    options?: OutputOptions,
    transactionOptions?: TransactionOptions
): Promise<Output> {
    return (await getAccount(accountIndex))?.prepareOutput(options, transactionOptions) as Promise<Output>
}
