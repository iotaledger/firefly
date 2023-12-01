import { get } from 'svelte/store'
import { PreparedTransaction } from '@iota/sdk/out/types'
import { IAccountState, selectedWallet } from '@core/account'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '../utils'
import { plainToInstance } from 'class-transformer'
import { updateActiveAccount } from '@core/profile'

export async function consolidateOutputs(accountToConsolidate?: IAccountState): Promise<void> {
    const account = accountToConsolidate || get(selectedWallet)
    if (!account) return Promise.reject('No account selected')

    try {
        updateActiveAccount(account.index, { hasConsolidatingOutputsTransactionInProgress: true, isTransferring: true })

        const preparedConsolidateOutputsTransaction = await account.prepareConsolidateOutputs({
            force: false,
            outputThreshold: 2,
            targetAddress: account.depositAddress,
        })
        const preparedTransaction = plainToInstance(PreparedTransaction, preparedConsolidateOutputsTransaction)
        const transaction = await preparedTransaction?.send()

        await processAndAddToActivities(transaction, account)
    } catch (err) {
        handleError(err)
        updateActiveAccount(account.index, {
            hasConsolidatingOutputsTransactionInProgress: false,
            isTransferring: false,
        })
    }
}
