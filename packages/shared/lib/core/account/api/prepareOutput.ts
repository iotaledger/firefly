import { getAccount } from '@core/profile-manager'
import { Output, OutputParams, TransactionOptions } from '@iota/sdk/out/types'

export async function prepareOutput(
    accountIndex: number,
    params: OutputParams,
    transactionOptions?: TransactionOptions
): Promise<Output> {
    return (await getAccount(accountIndex))?.prepareOutput(params, transactionOptions) as Promise<Output>
}
