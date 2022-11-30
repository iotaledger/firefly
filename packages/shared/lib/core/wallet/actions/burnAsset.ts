import { showAppNotification } from '@auxiliary/notification'
import { selectedAccount } from '@core/account/stores/selected-account.store'
import { handleError } from '@core/error/handlers/handleError'
import { localize } from '@core/i18n'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'
import { generateActivity, preprocessTransaction } from '../utils'

export async function burnAsset(assetId: string, rawAmount: string): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        const burnTokenTransaction = await account.burnNativeToken(assetId, '0x' + Number(rawAmount).toString(16))

        // Generate Activity
        const processedTransaction = preprocessTransaction(burnTokenTransaction)
        const activity = generateActivity(processedTransaction, account)
        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)

        showAppNotification({
            type: 'success',
            message: localize('notifications.burnNativeToken.success'),
            alert: true,
        })
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        } else {
            handleError(err)
        }
    }
}
