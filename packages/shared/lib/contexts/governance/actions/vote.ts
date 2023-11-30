import { PreparedTransaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'

import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { getSelectedWallet, processAndAddToActivities, updateSelectedWallet } from '@core/wallet'

export async function vote(eventId?: string, answers?: number[]): Promise<void> {
    const wallet = getSelectedWallet();
    try {
        updateSelectedWallet({ hasVotingTransactionInProgress: true })
        const prepareVoteTransaction = await wallet?.prepareVote(eventId, answers)
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareVoteTransaction)
        const transaction = await preparedTransaction?.send()

        await processAndAddToActivities(transaction, wallet)

        showAppNotification({
            type: 'success',
            message: localize('notifications.vote.success'),
            alert: true,
        })
    } catch (err) {
        updateSelectedWallet({ hasVotingTransactionInProgress: false })
        handleError(err)
    }
}
