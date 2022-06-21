import { OutputData } from '@iota/wallet'
import { syncBalance } from '@core/account/actions/syncBalance'
import { updateActivityClaimStateByTransactionId } from '@core/wallet/stores/all-account-activities.store'

export async function handleSpentOutput(accountId: string, payload: { output: OutputData }): Promise<void> {
    await syncBalance(accountId)
    updateActivityClaimStateByTransactionId(accountId, payload.output.metadata.transactionId)
}
