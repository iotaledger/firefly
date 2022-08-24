import { selectedAccount } from '@core/account/stores/selected-account.store'
import { BaseError } from '@core/error'
import { localize } from '@core/i18n'
import { checkStronghold } from '@lib/stronghold'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { ActivityType } from '../enums'
import { updateActivityDataByActivityId } from '../stores'

export async function claimActivity(activity: Activity): Promise<void> {
    await checkStronghold()
    const account = get(selectedAccount)
    try {
        const outputId = activity.data.type === ActivityType.Transaction ? activity.data.outputId : undefined
        updateActivityDataByActivityId(account.id, activity.id, { type: ActivityType.Transaction, isClaiming: true })
        const results = await account.claimOutputs([outputId])
        if (results.length > 0) {
            const transactionId = results[0].transactionId
            updateActivityDataByActivityId(account.id, activity.id, {
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
        updateActivityDataByActivityId(account.id, activity.id, { type: ActivityType.Transaction, isClaiming: false })
    }
}
