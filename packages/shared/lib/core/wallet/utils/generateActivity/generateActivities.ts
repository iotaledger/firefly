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
import { isParticipationOutput } from '@contexts/governance/utils'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { generateSingleGovernanceActivity } from './generateSingleGovernanceActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { getActivityTypeFromOutput } from './helper'
import { generateActivitiesFromNftOutputs } from './generateActivitiesFromNftOutputs'
import { generateActivitiesFromAliasOutputs } from './generateActivitiesFromAliasOutputs'
import { generateActivitiesFromFoundryOutputs } from './generateActivitiesFromFoundryOutputs'
import { generateActivitiesFromBasicOutputs } from './generateActivitiesFromBasicOutputs'

export async function generateActivities(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Promise<Activity[]> {
    if (processedTransaction.wrappedInputs?.length > 0) {
        return generateActivitiesFromProcessedTransactionsWithInputs(processedTransaction, account)
    } else {
        return generateActivitiesFromProcessedTransactionsWithoutInputs(processedTransaction, account)
    }
}

async function generateActivitiesFromProcessedTransactionsWithInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Promise<Activity[]> {
    const { outputs, wrappedInputs } = processedTransaction
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

    const hasParticipationInputs = wrappedInputs?.some((input) => isParticipationOutput(input.output))
    const governanceOutput = hasParticipationInputs
        ? processedTransaction?.outputs[0]
        : outputs.find((output) => isParticipationOutput(output.output))
    if (governanceOutput) {
        const governanceActivity = generateSingleGovernanceActivity(account, {
            processedTransaction,
            wrappedOutput: governanceOutput,
            action: null,
        })
        activities.push(governanceActivity)
    }

    if (!containsFoundryActivity && !containsNftActivity && !containsAliasActivity && !governanceOutput) {
        const basicActivities = await generateActivitiesFromBasicOutputs(processedTransaction, account)
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
            case ActivityType.Governance:
                return generateSingleGovernanceActivity(account, params)
            case ActivityType.Foundry:
                return generateSingleFoundryActivity(account, params)
            case ActivityType.Alias:
                return generateSingleAliasActivity(account, params)
            case ActivityType.Nft:
                return generateSingleNftActivity(account, params)
        }
    })
}
