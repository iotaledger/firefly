import { selectedAccount, updateSelectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers/handleError'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { processAndAddToActivities } from '../utils'

export async function consolidateOutputs(): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        updateSelectedAccount({ isTransferring: true })

        const transaction = await account.consolidateOutputs(false, 2)
        await processAndAddToActivities(transaction)
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err)
        } else {
            handleError(err)
        }
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
