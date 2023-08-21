import { PreparedTransaction, Transaction } from '@iota/sdk/out/types'
import { plainToInstance } from 'class-transformer'
import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/wallet/utils'
import { handleError } from '@core/error/handlers'
import { closePopup } from '@auxiliary/popup'

export async function setVotingPower(rawAmount: string): Promise<void> {
    const account = get(selectedAccount)
    try {
        if (!account) return

        const votingPower = parseInt(account.votingPower, 10)
        const amount = parseInt(rawAmount, 10)

        if (amount === votingPower) {
            return closePopup()
        }

        updateSelectedAccount({ hasVotingPowerTransactionInProgress: true, isTransferring: true })

        let transaction: Transaction
        let preparedTransaction: PreparedTransaction

        if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            const prepareDecreaseVotingPowerTransaction = await account?.prepareDecreaseVotingPower(
                amountToDecrease.toString()
            )
            preparedTransaction = plainToInstance(PreparedTransaction, prepareDecreaseVotingPowerTransaction)

            transaction = await preparedTransaction?.send()
        } else {
            const amountToIncrease = amount - votingPower
            const prepareIncreaseVotingPowerTransaction = await account?.prepareIncreaseVotingPower(
                amountToIncrease.toString()
            )
            preparedTransaction = plainToInstance(PreparedTransaction, prepareIncreaseVotingPowerTransaction)

            transaction = await preparedTransaction?.send()
        }

        await processAndAddToActivities(transaction, account)
    } catch (err) {
        handleError(err)
        updateSelectedAccount({ hasVotingPowerTransactionInProgress: false, isTransferring: false })
    }
}
