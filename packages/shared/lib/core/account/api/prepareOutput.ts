import { getAccount } from '@core/profile-manager'
import { IBasicOutput, OutputTypes } from '@iota/types'
import { OutputData, OutputOptions, PreparedTransactionData, TransactionOptions } from '@iota/wallet'
import { BuildBasicOutputData } from '@iota/wallet/out/types/buildOutputData'

export async function prepareOutput(
    accountId: string,
    options?: OutputOptions,
    transactionOptions?: TransactionOptions
): Promise<OutputTypes> {
    return (await getAccount(Number(accountId)))?.prepareOutput(options, transactionOptions)
}
