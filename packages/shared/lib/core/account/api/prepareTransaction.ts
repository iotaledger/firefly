import { getAccount } from '@core/profile-manager'
import { IBasicOutput, OutputTypes } from '@iota/types'
import { PreparedTransactionData, TransactionOptions } from '@iota/wallet'
import { BuildBasicOutputData } from '@iota/wallet/out/types/buildOutputData'

export async function prepareTransaction(
    id: string,
    outputs: OutputTypes[],
    options?: TransactionOptions
): Promise<PreparedTransactionData> {
    return (await getAccount(Number(id)))?.prepareTransaction(outputs, options)
}
