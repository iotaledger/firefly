import { selectedAccount } from '@core/account/stores/selected-account.store'
import { handleError } from '@core/error/handlers/handleError'
import { handleLedgerError } from '@core/ledger'
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
        const result = await account.claimOutputs([data.outputId])
        const transactionId = result.transactionId
        updateActivityDataByActivityId(account.id, activityId, {
            type: ActivityType.Transaction,
            claimingTransactionId: transactionId,
        })
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        } else {
            handleError(err)
        }
        updateActivityDataByActivityId(account.id, activityId, { type: ActivityType.Transaction, isClaiming: false })
    }
}
