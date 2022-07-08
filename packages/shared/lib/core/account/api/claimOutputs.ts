import { getAccount } from '@core/profile-manager'
import { Transaction } from '@iota/wallet'

export async function claimOutputs(id: string, outputIds: string[]): Promise<Transaction[]> {
    return (await getAccount(Number(id)))?.claimOutputs(outputIds)
}
