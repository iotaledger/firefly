import { selectedAccount } from '@core/account/stores/selected-account.store'
import { BaseError } from '@core/error'
import { localize } from '@core/i18n'
import { checkActiveProfileAuth } from '@core/profile'
import { get } from 'svelte/store'
import { ActivityType } from '../enums'
import { ITransactionActivityData } from '../interfaces'
import { updateActivityDataByActivityId } from '../stores'

export async function claimActivity(activityId: string, data: ITransactionActivityData): Promise<void> {
    await checkActiveProfileAuth()
    const account = get(selectedAccount)
    try {
        updateActivityDataByActivityId(account.id, activityId, { type: ActivityType.Transaction, isClaiming: true })
        const results = await account.claimOutputs([data.outputId])
        if (results.length > 0) {
            const transactionId = results[0].transactionId
            updateActivityDataByActivityId(account.id, activityId, {
                type: ActivityType.Transaction,
                claimingTransactionId: transactionId,
            })
        }
    } catch (err) {
        if (!err.message) {
            new BaseError({
                message: localize('notifications.claimed.error'),
                logToConsole: true,
                showNotification: true,
            })
        }
        updateActivityDataByActivityId(account.id, activityId, { type: ActivityType.Transaction, isClaiming: false })
    }
}
