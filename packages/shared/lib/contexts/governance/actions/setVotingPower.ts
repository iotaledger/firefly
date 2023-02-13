import { get } from 'svelte/store'

import { Transaction } from '@iota/wallet/out/types'

import { selectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/wallet/utils'

import {
    clearHasPendingGovernanceTransactionForAccount,
    hasToRevote,
    setHasPendingGovernanceTransactionForAccount,
} from '../stores'
import { handleError } from '@core/error/handlers'

export async function setVotingPower(rawAmount: string, isVoting: boolean): Promise<void> {
    const account = get(selectedAccount)
    try {
        // If voting power is set to '0', the PARTICIPATE tag is removed and no revoting has to occur.
        hasToRevote.set(rawAmount !== '0' && isVoting)

        const votingPower = parseInt(account.votingPower, 10)
        const amount = parseInt(rawAmount, 10)

        setHasPendingGovernanceTransactionForAccount(account.index)

        let transaction: Transaction
        if (amount > votingPower) {
            const amountToIncrease = amount - votingPower
            transaction = await account.increaseVotingPower(amountToIncrease.toString())
        } else if (amount < votingPower) {
            const amountToDecrease = votingPower - amount
            transaction = await account.decreaseVotingPower(amountToDecrease.toString())
        }
        await processAndAddToActivities(transaction, account)
    } catch (err) {
        hasToRevote.set(false)
        handleError(err)
        clearHasPendingGovernanceTransactionForAccount(account.index)
    }
}
