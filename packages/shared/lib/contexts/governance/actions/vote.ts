import { PreparedTransaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

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
        const prepareVoteTransaction = await account?.prepareVote(eventId, answers)
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareVoteTransaction)
        const transaction = await preparedTransaction?.send()

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
