import { get } from 'svelte/store'
import type { Transaction } from '@iota/wallet/out/types'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/wallet/utils'

export async function stopVotingForProposal(eventId: string): Promise<Transaction> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ hasVotingTransactionInProgress: true })
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
        updateSelectedAccount({ hasVotingTransactionInProgress: false })
    }
}
