import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'

export async function consolidateOutputs(): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ isTransferring: true })

        const transaction = await account.consolidateOutputs({ force: false, outputThreshold: 2 })
        await processAndAddToActivities(transaction, account)
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
