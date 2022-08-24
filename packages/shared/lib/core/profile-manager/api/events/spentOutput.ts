import { OutputData } from '@iota/wallet'
import { syncBalance } from '@core/account/actions/syncBalance'
import {
    allAccountActivities,
    updateActivityDataByTransactionId,
} from '@core/wallet/stores/all-account-activities.store'
import { get } from 'svelte/store'
import { ActivityAsyncStatus } from '@core/wallet'

export async function handleSpentOutput(accountId: string, payload: { output: OutputData }): Promise<void> {
    await syncBalance(accountId)
    const transactionId = payload?.output?.metadata?.transactionId
    const activity = get(allAccountActivities)?.[Number(accountId)]?.find((_activity) => _activity.id === transactionId)

    if (activity?.data.type === 'transaction' && activity?.data.asyncStatus === ActivityAsyncStatus.Unclaimed) {
        updateActivityDataByTransactionId(accountId, transactionId, {
            type: 'transaction',
            isClaimed: true,
            asyncStatus: ActivityAsyncStatus.Claimed,
        })
    }
}
