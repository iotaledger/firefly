import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/wallet'
import { GovernanceTransactionType } from '@contexts/governance/enums'

export async function vote(eventId?: string, answers?: number[]): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ processingGovernanceTransactionType: GovernanceTransactionType.Vote })

        const transaction = await account.vote(eventId, answers)
        await processAndAddToActivities(transaction, account)

        showAppNotification({
            type: 'success',
            message: localize('notifications.vote.success'),
            alert: true,
        })
    } catch (err) {
        updateSelectedAccount({ processingGovernanceTransactionType: null })
        handleError(err)
    }
}
