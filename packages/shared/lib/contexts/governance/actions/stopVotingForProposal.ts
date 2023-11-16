import { PreparedTransaction, type Transaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'
import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/wallet/utils'

export async function stopVotingForProposal(eventId: string): Promise<Transaction | undefined> {
    const account = get(selectedAccount)
    try {
        updateSelectedAccount({ hasVotingTransactionInProgress: true })
        const prepareStopParticipatingTransaction = await account?.prepareStopParticipating(eventId)
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareStopParticipatingTransaction)
        const transaction = await preparedTransaction?.send()

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
