import { get } from 'svelte/store'
import { Transaction } from '@iota/wallet/out/types'
import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { processAndAddToActivities } from '@core/wallet/utils'
import { handleError } from '@core/error/handlers'
import { GovernanceTransactionType } from '@contexts/governance/enums'

export async function setVotingPower(rawAmount: string): Promise<void> {
    const account = get(selectedAccount)
    try {
        const votingPower = parseInt(account.votingPower, 10)
        const amount = parseInt(rawAmount, 10)

        updateSelectedAccount({
            processingGovernanceTransactionType: GovernanceTransactionType.VotingPower,
            isTransferring: true,
        })

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
        handleError(err)
        updateSelectedAccount({
            processingGovernanceTransactionType: GovernanceTransactionType.VotingPower,
            isTransferring: false,
        })
    }
}
