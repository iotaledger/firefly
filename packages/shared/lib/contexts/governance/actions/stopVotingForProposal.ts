import { PreparedTransaction, type Transaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { getSelectedWallet, updateSelectedWallet } from '@core/wallet'

export async function stopVotingForProposal(eventId: string): Promise<Transaction | undefined> {
    const wallet = getSelectedWallet()
    try {
        updateSelectedWallet({ hasVotingTransactionInProgress: true })
        const prepareStopParticipatingTransaction = await wallet?.prepareStopParticipating(eventId)
        const preparedTransaction = plainToInstance(PreparedTransaction, prepareStopParticipatingTransaction)
        const transaction = await preparedTransaction?.send()

        

        showAppNotification({
            type: 'success',
            message: localize('notifications.stopVoting.success'),
            alert: true,
        })
        return transaction
    } catch (err) {
        handleError(err)
        updateSelectedWallet({ hasVotingTransactionInProgress: false })
    }
}
