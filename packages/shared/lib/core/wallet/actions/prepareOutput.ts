import { Output, OutputParams, TransactionOptions } from '@iota/sdk/out/types'
import { getWallet } from '@core/profile'

// TODO(2.0) Fix all usages
export async function prepareOutput(
    walletId: string,
    params: OutputParams,
    transactionOptions?: TransactionOptions
): Promise<Output> {
    return (await getWallet(walletId))?.prepareOutput(params, transactionOptions) as Promise<Output>
}
