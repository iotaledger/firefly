import { get } from 'svelte/store'

import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'

export async function stopVotingForProposal(eventId: string): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        await account.stopParticipating(eventId)
        showAppNotification({
            type: 'success',
            message: localize('notifications.stopVoting.success'),
            alert: true,
        })
    } catch (err) {
        console.error(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
