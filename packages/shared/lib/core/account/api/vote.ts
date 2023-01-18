import { get } from 'svelte/store'
import { Transaction } from '@iota/wallet'

import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { activeProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile'
import { handleLedgerError } from '@core/ledger/utils'

export async function vote(eventId?: string, answers?: number[]): Promise<Transaction> {
    try {
        const account = get(selectedAccount)
        updateSelectedAccount({ isTransferring: true })
        await account.vote(eventId, answers)
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
