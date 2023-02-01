import { get } from 'svelte/store'
import type { Transaction } from '@iota/wallet'

import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import {
    addActivitiesToAccountActivitiesInAllAccountActivities,
    generateActivities,
    preprocessTransaction,
} from '@core/wallet'

export async function stopVotingForProposal(eventId: string): Promise<Transaction> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const transaction = await account?.stopParticipating(eventId)

        const preprocessedTransaction = await preprocessTransaction(transaction, account)
        const activities = generateActivities(preprocessedTransaction, account)
        addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)

        showAppNotification({
            type: 'success',
            message: localize('notifications.stopVoting.success'),
            alert: true,
        })
        return transaction
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
