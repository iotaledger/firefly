import { IAccountState } from '@core/account'
import { ActivityType, getActivityType, IProcessedTransaction } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateTransactionActivity } from './generateTransactionActivity'
import { generateFoundryActivity } from './generateFoundryActivity'
import { generateAliasActivity } from './generateAliasActivity'
import { generateNftActivity } from './generateNftActivity'

export function generateActivity(processedTransaction: IProcessedTransaction, account: IAccountState): Activity {
    const type = getActivityType(processedTransaction.outputs)

    switch (type) {
        case ActivityType.Basic:
            return generateTransactionActivity(processedTransaction, account)
        case ActivityType.Foundry:
            return generateFoundryActivity(processedTransaction, account)
        case ActivityType.Alias:
            return generateAliasActivity(processedTransaction, account)
        case ActivityType.Nft:
            return generateNftActivity(processedTransaction, account)
    }
}
