import { IAccountState } from '@core/account'
import {
    ActivityAction,
    ActivityType,
    IProcessedTransaction,
    OUTPUT_TYPE_ALIAS,
    OUTPUT_TYPE_FOUNDRY,
    OUTPUT_TYPE_NFT,
} from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { getActivityTypeFromOutput } from './helper'
import { generateActivitiesFromNftOutputs } from './generateActivitiesFromNftOutputs'
import { generateActivitiesFromAliasOutputs } from './generateActivitiesFromAliasOutputs'
import { generateActivitiesFromBasicOutputs } from './generateActivitiesFromBasicOutputs'
import { generateActivitiesFromFoundryOutputs } from './generateActivitiesFromFoundryOutputs'

export function generateActivities(processedTransaction: IProcessedTransaction, account: IAccountState): Activity[] {
    if (processedTransaction.wrappedInputs?.length > 0) {
        return generateActivitiesFromProcessedTransactionsWithInputs(processedTransaction, account)
    } else {
        return generateActivitiesFromProcessedTransactionsWithoutInputs(processedTransaction, account)
    }
}

function generateActivitiesFromProcessedTransactionsWithInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const outputs = processedTransaction.outputs
    const activities: Activity[] = []

    const containsFoundryActivity = outputs.some((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
    if (containsFoundryActivity) {
        const foundryActivities = generateActivitiesFromFoundryOutputs(processedTransaction, account)
        activities.push(...foundryActivities)
    }

    const containsNftActivity = outputs.some((output) => output.output.type === OUTPUT_TYPE_NFT)
    if (containsNftActivity) {
        const nftActivities = generateActivitiesFromNftOutputs(processedTransaction, account)
        activities.push(...nftActivities)
    }

    const containsAliasActivity =
        outputs.some((output) => output.output.type === OUTPUT_TYPE_ALIAS) && !containsFoundryActivity
    if (containsAliasActivity) {
        const aliasActivities = generateActivitiesFromAliasOutputs(processedTransaction, account)
        activities.push(...aliasActivities)
    }

    if (!containsFoundryActivity && !containsNftActivity && !containsAliasActivity) {
        const basicActivities = generateActivitiesFromBasicOutputs(processedTransaction, account)
        activities.push(...basicActivities)
    }

    return activities
}

/*
 * If we cannot get the detailed inputs for a transaction, we would need to blind guess what the user did with the transaction.
 * Therefore we set the action to `Unknown`
 */
function generateActivitiesFromProcessedTransactionsWithoutInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const nonRemainderOutputs = processedTransaction.outputs.filter((wrappedOutput) => !wrappedOutput.remainder)
    return nonRemainderOutputs.map((wrappedOutput) => {
        const params = {
            type: getActivityTypeFromOutput(wrappedOutput),
            action: ActivityAction.Unknown,
            processedTransaction,
            wrappedOutput,
        }
        switch (params.type) {
            case ActivityType.Basic:
                return generateSingleBasicActivity(account, params)
            case ActivityType.Foundry:
                return generateSingleFoundryActivity(account, params)
            case ActivityType.Alias:
                return generateSingleAliasActivity(account, params)
            case ActivityType.Nft:
                return generateSingleNftActivity(account, params)
        }
    })
}
