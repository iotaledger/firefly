import { get } from 'svelte/store'
import { Transaction } from '@iota/wallet'

import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { activeProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile/enums'
import { handleLedgerError } from '@core/ledger/utils'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'

export async function vote(eventId?: string, answers?: number[]): Promise<Transaction> {
    try {
        updateSelectedAccount({ isTransferring: true })

        const account = get(selectedAccount)
        await account.vote(eventId, answers)

        showAppNotification({
            type: 'success',
            message: localize('notifications.vote.success'),
            alert: true,
        })
    } catch (err) {
        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err?.error)
        }
        return Promise.reject(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
