import { get } from 'svelte/store'
import { PreparedTransaction } from '@iota/sdk/out/types'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'
import { plainToInstance } from 'class-transformer'

export async function consolidateOutputs(): Promise<void> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ isTransferring: true })

        const preparedConsolidateOutputsTransaction = await account?.prepareConsolidateOutputs({
            force: false,
            outputThreshold: 2,
        })
        const preparedTransaction = plainToInstance(PreparedTransaction, preparedConsolidateOutputsTransaction)
        const transaction = await preparedTransaction?.send()

        await processAndAddToActivities(transaction, account)
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
