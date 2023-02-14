import { get } from 'svelte/store'
import type { Transaction } from '@iota/wallet'

import { selectedAccount } from '@core/account/stores'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/wallet/utils'
import { clearHasPendingGovernanceTransactionForAccount, setHasPendingGovernanceTransactionForAccount } from '../stores'

export async function stopVotingForProposal(eventId: string): Promise<Transaction> {
    const account = get(selectedAccount)
    try {
        setHasPendingGovernanceTransactionForAccount(account.index)
        const transaction = await account?.stopParticipating(eventId)

        await processAndAddToActivities(transaction, account)

        showAppNotification({
            type: 'success',
            message: localize('notifications.stopVoting.success'),
            alert: true,
        })
        return transaction
    } catch (err) {
        handleError(err)
        clearHasPendingGovernanceTransactionForAccount(account.index)
    }
}
