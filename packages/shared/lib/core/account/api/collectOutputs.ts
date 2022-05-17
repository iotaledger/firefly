import { getAccount } from '@core/profile-manager'
import { TransactionReceipt } from '@iota/wallet'

export async function collectOutputs(id: string, outputIds: string[]): Promise<TransactionReceipt[]> {
    return (await getAccount(Number(id)))?.collectOutputs(outputIds)
}
