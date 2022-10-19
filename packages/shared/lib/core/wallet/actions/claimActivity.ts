import { selectedAccount } from '@core/account/stores/selected-account.store'
import { handleError } from '@core/error/handlers/handleError'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { updateActivityByActivityId } from '../stores'
import { Activity } from '../types'

export async function claimActivity(activity: Activity): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        updateActivityByActivityId(account.index, activity.id, { isClaiming: true })
        const result = await account.claimOutputs([activity.outputId])
        const transactionId = result.transactionId
        updateActivityByActivityId(account.index, activity.id, { claimingTransactionId: transactionId })
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        } else {
            handleError(err)
        }
        updateActivityByActivityId(account.index, activity.id, { isClaiming: false })
    }
}
