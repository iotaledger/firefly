import { PreparedTransaction, Transaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'
import { processAndAddToActivities } from '@core/wallet/utils'
import { handleError } from '@core/error/handlers'
import { closePopup } from '@auxiliary/popup'
import { getSelectedWallet, updateSelectedWallet } from 'shared/lib/core/wallet'

export async function setVotingPower(rawAmount: string): Promise<void> {
    const wallet = getSelectedWallet();
    try {
        if (!wallet) return

        const votingPower = parseInt(wallet.votingPower, 10)
        const amount = parseInt(rawAmount, 10)

        if (amount === votingPower) {
            return closePopup()
        }

        updateSelectedWallet({ hasVotingPowerTransactionInProgress: true, isTransferring: true })

        let transaction: Transaction
        let preparedTransaction: PreparedTransaction

        if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            const prepareDecreaseVotingPowerTransaction = await wallet?.prepareDecreaseVotingPower(
                amountToDecrease.toString()
            )
            preparedTransaction = plainToInstance(PreparedTransaction, prepareDecreaseVotingPowerTransaction)

            transaction = await preparedTransaction?.send()
        } else {
            const amountToIncrease = amount - votingPower
            const prepareIncreaseVotingPowerTransaction = await wallet?.prepareIncreaseVotingPower(
                amountToIncrease.toString()
            )
            preparedTransaction = plainToInstance(PreparedTransaction, prepareIncreaseVotingPowerTransaction)

            transaction = await preparedTransaction?.send()
        }

        await processAndAddToActivities(transaction, wallet)
    } catch (err) {
        handleError(err)
        updateSelectedWallet({ hasVotingPowerTransactionInProgress: false, isTransferring: false })
    }
}
