import { selectedAccount } from '@core/account/stores/selected-account.store'
import { handleError } from '@core/error/handlers/handleError'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { updateAsyncDataByActivityId } from '../stores'
import { Activity } from '../types'

export async function claimActivity(activity: Activity): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        updateAsyncDataByActivityId(account.index, activity.id, { isClaiming: true })
        const result = await account.claimOutputs([activity.outputId])
        const transactionId = result.transactionId
        updateAsyncDataByActivityId(account.index, activity.id, { claimingTransactionId: transactionId })
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        } else {
            handleError(err)
        }
        updateAsyncDataByActivityId(account.index, activity.id, { isClaiming: false })
    }
}
