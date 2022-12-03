import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import {
    addActivityToAccountActivitiesInAllAccountActivities,
    generateActivity,
    preprocessTransaction,
} from '@core/wallet'

export async function setVotingPower(rawAmount: string): Promise<void> {
    try {
        const account = get(selectedAccount)
        updateSelectedAccount({ isTransferring: true })
        const votingPower = parseInt(account.votingPower, 10)
        const amount = parseInt(rawAmount, 10)
        if (amount > votingPower) {
            const amountToIncrease = amount - votingPower
            const transaction = await account.increaseVotingPower(amountToIncrease.toString())
            const activity = generateActivity(preprocessTransaction(transaction, account.depositAddress), account)
            addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)
        } else if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            const transaction = await account.decreaseVotingPower(amountToDecrease.toString())
            const activity = generateActivity(preprocessTransaction(transaction, account.depositAddress), account)
            addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)
        }
        updateSelectedAccount({ isTransferring: false })
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
    }
}
