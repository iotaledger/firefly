import { selectedAccount } from '@core/account/stores/selected-account.store'
import { BaseError } from '@core/error'
import { localize } from '@core/i18n'
import { handleLedgerError, LedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { ActivityType } from '../enums'
import { ITransactionActivityData } from '../interfaces'
import { updateActivityDataByActivityId } from '../stores'

export async function claimActivity(activityId: string, data: ITransactionActivityData): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        updateActivityDataByActivityId(account.id, activityId, { type: ActivityType.Transaction, isClaiming: true })
        const results = await account.claimOutputs([data.outputId])
        if (results.length > 0) {
            const transactionId = results[0].transactionId
            updateActivityDataByActivityId(account.id, activityId, {
                type: ActivityType.Transaction,
                claimingTransactionId: transactionId,
            })
        } else if (_activeProfile.type === ProfileType.Ledger) {
            // Wallet.rs doesn't throw an error for claiming (multiple) outputs.
            // Multiple outputs could be claimed in multiple transactions and
            // it's possible for some to fail and others to succeed.
            throw new Error(LedgerError.DeniedByUser)
        }
    } catch (err) {
        if (!err.message) {
            new BaseError({
                message: localize('notifications.claimed.error'),
                logToConsole: true,
                showNotification: true,
            })
        } else if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.message)
        }
        updateActivityDataByActivityId(account.id, activityId, { type: ActivityType.Transaction, isClaiming: false })
    }
}
