import { getAccount } from '@core/profile-manager'
import { TransactionResult } from '@iota/wallet'

export async function collectOutputs(id: string, outputIds: string[]): Promise<TransactionResult[]> {
    return (await getAccount(Number(id)))?.collectOutputs(outputIds)
}
