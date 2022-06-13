import { OutputData } from '@iota/wallet'
import { syncBalance } from '@core/account/actions/syncBalance'

export async function handleSpentOutput(accountId: string, payload: { output: OutputData }): Promise<void> {
    await syncBalance(accountId)
}
