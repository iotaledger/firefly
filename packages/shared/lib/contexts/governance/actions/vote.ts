import { get } from 'svelte/store'
import { selectedAccount } from '@core/account/stores'
import { activeProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile/enums'
import { handleLedgerError } from '@core/ledger/utils'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/wallet'
import { clearHasPendingGovernanceTransactionForAccount, setHasPendingGovernanceTransactionForAccount } from '../stores'

export async function vote(eventId?: string, answers?: number[]): Promise<void> {
    const account = get(selectedAccount)
    try {
        setHasPendingGovernanceTransactionForAccount(account.index)

        const transaction = await account.vote(eventId, answers)

        await processAndAddToActivities(transaction)

        showAppNotification({
            type: 'success',
            message: localize('notifications.vote.success'),
            alert: true,
        })
    } catch (err) {
        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err?.error)
        } else {
            handleError(err)
        }
        clearHasPendingGovernanceTransactionForAccount(account.index)
    }
}
