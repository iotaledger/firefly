import { get } from 'svelte/store'

import { Transaction } from '@iota/wallet/out/types'

import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { addActivitiesToAccountActivitiesInAllAccountActivities } from '@core/wallet/stores'
import { generateActivities, preprocessTransaction } from '@core/wallet/utils'

import { hasToRevote } from '../stores'
import { isSelectedAccountVoting } from '../utils'

export async function setVotingPower(rawAmount: string): Promise<void> {
    try {
        // If voting power is set to '0', the PARTICIPATE tag is removed and no revoting has to occur.
        const isVoting = await isSelectedAccountVoting()
        hasToRevote.set(rawAmount !== '0' && isVoting)

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

        await processAndAddToActivities(transaction)
        updateSelectedAccount({ isTransferring: false })
    } catch (err) {
        hasToRevote.set(false)
        updateSelectedAccount({ isTransferring: false })
    }
}

async function processAndAddToActivities(transaction: Transaction): Promise<void> {
    const account = get(selectedAccount)
    const preprocessedTransaction = await preprocessTransaction(transaction, account)
    const activities = generateActivities(preprocessedTransaction, account)
    addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
}
