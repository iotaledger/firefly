import { get } from 'svelte/store'
import { Transaction } from '@iota/sdk/out/types'
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

        if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            transaction = await account.decreaseVotingPower(amountToDecrease.toString())
        } else {
            const amountToIncrease = amount - votingPower
            transaction = await account.increaseVotingPower(amountToIncrease.toString())
        }

        await processAndAddToActivities(transaction, account)
    } catch (err) {
        handleError(err)
        updateSelectedAccount({ hasVotingPowerTransactionInProgress: false, isTransferring: false })
    }
}
