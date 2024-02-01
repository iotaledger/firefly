import { Output, OutputParams, TransactionOptions } from '@iota/sdk/out/types'
import { getWallet } from '@core/profile'

export async function prepareOutput(
    walletId: string,
    params: OutputParams,
    transactionOptions?: TransactionOptions
): Promise<Output> {
    return (await getWallet(walletId))?.prepareOutput(params, transactionOptions) as Promise<Output>
}
