import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/wallet'

export async function vote(eventId?: string, answers?: number[]): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ hasVotingTransactionInProgress: true })

        const transaction = await account.vote(eventId, answers)
        await processAndAddToActivities(transaction, account)

        showAppNotification({
            type: 'success',
            message: localize('notifications.vote.success'),
            alert: true,
        })
    } catch (err) {
        updateSelectedAccount({ hasVotingTransactionInProgress: false })
        handleError(err)
    }
}
