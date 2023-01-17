import { votingPowerTransactionState } from '@contexts/governance'
import { selectedAccount, updateSelectedAccount } from '@core/account'
import {
    addActivitiesToAccountActivitiesInAllAccountActivities,
    generateActivities,
    preprocessTransaction,
} from '@core/wallet'
import { InclusionState, Transaction } from '@iota/wallet/out/types'
import { get } from 'svelte/store'

export async function setVotingPower(rawAmount: string): Promise<void> {
    try {
        const account = get(selectedAccount)
        updateSelectedAccount({ isTransferring: true })
        const votingPower = parseInt(account.votingPower, 10)
        const amount = parseInt(rawAmount, 10)

        let transaction: Transaction
        if (amount > votingPower) {
            const amountToIncrease = amount - votingPower
            transaction = await account.increaseVotingPower(amountToIncrease.toString())
        } else if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            transaction = await account.decreaseVotingPower(amountToDecrease.toString())
        }

        votingPowerTransactionState.set(InclusionState.Pending)
        await processAndAddToActivities(transaction)

        updateSelectedAccount({ isTransferring: false })
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
    }
}

async function processAndAddToActivities(transaction: Transaction): Promise<void> {
    const account = get(selectedAccount)
    const preprocessedTransaction = await preprocessTransaction(transaction, account)
    const activities = generateActivities(preprocessedTransaction, account)
    addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
}
