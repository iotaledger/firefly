import { OutputData } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function listUnspentOutputs(id?: string): Promise<OutputData[]> {
    return (await getAccount(Number(id)))?.listUnspentOutputs()
}
